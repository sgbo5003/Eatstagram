import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaRegEdit } from "react-icons/fa";
import { useHistory } from "react-router";
import storyProfileImg1 from "../../../public/images/명수스토리.jpg";
import Modal from "../../Modal";
import ChatCreateModal from "./ChatCreateModal";
import ChatInitialRightComponent from "./ChatInitialRightComponent";
import ChatRoom from "./ChatRoom";
import Header from "../Header";
import * as fncObj from "../../commonFunc/CommonObjFunctions";

const Chat = (props) => {
  const localUserName = localStorage.getItem("username");
  const paramsId = props.location.search.split("=")[1];
  const [chatCreateModalOn, setChatCreateModalOn] = useState(false); // 채팅 생성 모달 제어
  const [chatStart, setChatStart] = useState(false); // 채팅 시작 여부
  const [roomList, setRoomList] = useState([]); // 채팅방 목록 array
  const [newRoomList, setNewRoomList] = useState([]); // 새로 초대한 채팅방 목록 array
  const [newRoomUserInfo, setNewRoomUserInfo] = useState([]);
  const [readState, setReadState] = useState(false);
  const history = useHistory();
  const webSocketUrl = `ws://localhost:8080/eatstagram/ws/directMessageRoomList/${localUserName}`;
  let ws = useRef(null);

  // 새로운 메세지 모달 띄우기
  const onCreateWriteModalHandler = () => {
    setChatCreateModalOn(true);
  };

  // 채팅 시작
  const onChatStartHandler = (data) => {
    setChatStart(true);
    history.push(`/Chat?idx=${data.directMessageRoomId}`);
  };

  // 채팅방 목록 불러오기

  const getChatList = () => {
    fncObj.executeQuery({
      url: "directMessageRoom/getList",
      data: {
        username: localUserName,
      },
      success: (res) => {
        setRoomList(res);
      },
    });
  };

  useEffect(() => {
    history.push("/Chat");
    getChatList();
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(webSocketUrl);
    ws.current.onopen = () => {
      console.log("connected to " + webSocketUrl);
      // 안읽은 채팅이 있는지 조회 -> readYn : Y or N
    };
    ws.current.onclose = (error) => {
      console.log("disconnect from " + webSocketUrl);
      console.log(error);
      // 안읽은 채팅이 있는지 조회 -> readYn : Y or N
    };
    ws.current.onerror = (error) => {
      console.log("connection error " + webSocketUrl);
      console.log(error);
    };
    ws.current.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.newYn === "Y") {
        newRoomList.push(data);
        setNewRoomList([...newRoomList]);
        setNewRoomUserInfo([...data.userList]);
      } else if (data.newYn === "N") {
        return;
      }
    };
    return () => {
      console.log("clean up");
      ws.current.close();
    };
  }, []);

  return (
    <>
      <div className="main-area">
        <div className="chat-area">
          <div className="chat-left">
            <div className="chat-me">
              <h1>gyuxxr</h1>
              <p onClick={onCreateWriteModalHandler}>
                <FaRegEdit />
              </p>
            </div>
            <div className="chat-list">
              {roomList.map((data, idx) => {
                return (
                  <div
                    className="chatting-list"
                    key={idx}
                    onClick={() => onChatStartHandler(data)}
                  >
                    <div className="chatting-friend">
                      <img src={storyProfileImg1} alt="" />
                    </div>
                    {data.directMessageRoomMemberDTOList.map((data, idx) => {
                      return (
                        <>
                          <div className="chatting-text" key={idx}>
                            <h1>
                              {data.nickname === null ? "유저1" : data.nickname}
                            </h1>
                          </div>
                          {readState ? <span className="state">·</span> : ""}
                        </>
                      );
                    })}
                  </div>
                );
              })}
              {newRoomList.map((data, idx) => {
                return (
                  <div
                    className="chatting-list"
                    key={idx}
                    onClick={() => onChatStartHandler(data)}
                  >
                    {newRoomUserInfo.map((data, idx) => {
                      if (data.username !== localUserName) {
                        return (
                          <div className="chatting-list-items" key={idx}>
                            <div className="chatting-friend">
                              <img src={storyProfileImg1} alt="" />
                            </div>
                            <div className="chatting-text">
                              <h1>{data.nickname}</h1>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          {chatStart ? (
            <ChatRoom paramsId={paramsId} />
          ) : (
            <ChatInitialRightComponent
              onCreateWriteModalHandler={onCreateWriteModalHandler}
            />
          )}
        </div>
      </div>
      <Modal isOpen={chatCreateModalOn} setIsOpen={setChatCreateModalOn}>
        <ChatCreateModal setChatCreateModalOn={setChatCreateModalOn} ws={ws} />
      </Modal>
    </>
  );
};

export default Chat;
