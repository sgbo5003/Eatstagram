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

let roomListObj;
let newRoomListObj;

const Chat = (props) => {
  const { messageCount, setMessageCount } = props;
  const localUserName = localStorage.getItem("username");
  const paramsId = location.search.split("=")[1];
  const [chatCreateModalOn, setChatCreateModalOn] = useState(false); // 채팅 생성 모달 제어
  const [chatStart, setChatStart] = useState(false); // 채팅 시작 여부
  const [roomList, setRoomList] = useState([]); // 채팅방 목록 array
  const [newRoomList, setNewRoomList] = useState([]); // 새로 초대한 채팅방 목록 array
  const [newRoomUserInfo, setNewRoomUserInfo] = useState([]);
  const history = useHistory();
  const webSocketUrl = `ws://localhost:8080/eatstagram/ws/directMessageRoomList/${localUserName}`;
  let ws = useRef(null);

  roomListObj = [...roomList];
  newRoomListObj = [...newRoomList];

  // 새로운 메세지 모달 띄우기
  const onCreateWriteModalHandler = () => {
    setChatCreateModalOn(true);
  };

  // 채팅 시작(채팅 목록 클릭 시)
  const onChatStartHandler = (data, idx) => {
    const alertYn = data.alertYn;
    setChatStart(true);
    history.push(`/Chat?idx=${data.directMessageRoomId}`);
    if (alertYn === "N") {
      return;
    } else if (alertYn === "Y") {
      setMessageCount((count) => count - 1);
      if (roomList.length > 0) {
        roomList[idx].alertYn = "N";
        setRoomList([...roomList]);
      } else if (newRoomList.length > 0) {
        newRoomList[idx].alertYn = "N";
        setNewRoomList([...newRoomList]);
      }
    }
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
  // 채팅 연결 되었는지 체크
  const chatConnectCheck = (data) => {
    if (paramsId !== undefined) {
      fncObj.executeQuery({
        url: "directMessageRoomMemberStatus/updateConnectionYn",
        data: {
          directMessageRoomId: paramsId,
          username: localUserName,
          connectionYn: data,
        },
        success: (res) => {},
      });
    }
  };

  useEffect(() => {
    history.push("/Chat");
    chatConnectCheck("N");
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
      console.log(data);
      if (data.type === "createDirectMessageRoom") {
        if (data.newYn === "Y") {
          newRoomList.push(data);
          setNewRoomList([...newRoomList]);
          setNewRoomUserInfo([...data.userList]);
        } else if (data.newYn === "N") {
          return;
        }
      } else if (data.type === "alert") {
        let roomListIdx;
        let newRoomListIdx;
        // db기반 채팅 목록 readYn 제어
        onListReadYnHandler(roomListObj, roomListIdx, setRoomList, data);
        // 새로운 채팅방 생성 시 readYn 제어
        onListReadYnHandler(
          newRoomListObj,
          newRoomListIdx,
          setNewRoomList,
          data
        );
      }
    };
    return () => {
      console.log("clean up");
      ws.current.close();
    };
  }, []);

  // 유저 리스트에서 읽었는지 안읽었는지 값을 변경해주는 함수
  const onListReadYnHandler = (listObj, listIdx, set, data) => {
    if (listObj.length > 0) {
      // 빈값이면 undefined 때문에 check
      listObj.map((item, idx) => {
        if (data.directMessageRoomId === listObj[idx].directMessageRoomId) {
          listIdx = idx;
        }
      });
      listObj[listIdx].alertYn = "Y";
      set([...listObj]);
    }
  };

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
              {newRoomList.map((data, idx) => {
                return (
                  <div
                    className="chatting-list"
                    key={idx}
                    onClick={() => onChatStartHandler(data, idx)}
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
                    {data.alertYn === "Y" ? (
                      <span className="state">·</span>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
              {roomList.map((data, idx) => {
                return (
                  <div
                    className="chatting-list"
                    onClick={() => onChatStartHandler(data, idx)}
                    key={idx}
                  >
                    <div className="chatting-friend">
                      <img src={storyProfileImg1} alt="" />
                    </div>
                    {data.directMessageRoomMemberDTOList.map((data, idx) => {
                      return (
                        <div className="chatting-text" key={idx}>
                          <h1>
                            {data.nickname === null ? "유저1" : data.nickname}
                          </h1>
                        </div>
                      );
                    })}
                    {data.alertYn === "Y" ? (
                      <span className="state">·</span>
                    ) : (
                      ""
                    )}
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
