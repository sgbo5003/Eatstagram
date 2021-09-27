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
    };
    ws.current.onclose = (error) => {
      console.log("disconnect from " + webSocketUrl);
      console.log(error);
    };
    ws.current.onerror = (error) => {
      console.log("connection error " + webSocketUrl);
      console.log(error);
    };
    ws.current.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      console.log(data);
    };
    return () => {
      console.log("clean up");
      ws.current.close();
    };
  }, []);

  return (
    <>
      <Header />
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
                        <div className="chatting-text" key={idx}>
                          <h1>{data.nickname}</h1>
                        </div>
                      );
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
