import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaRegEdit } from "react-icons/fa";
import { useHistory } from "react-router";
import storyProfileImg1 from "../../../public/images/명수스토리.jpg";
import profileDefaultImg from "../../../public/images/default_user.png";
import Modal from "../../Modal";
import ChatCreateModal from "./ChatCreateModal";
import ChatInitialRightComponent from "./ChatInitialRightComponent";
import ChatRoom from "./ChatRoom";
import Header from "../Header";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import axios from "axios";

let roomListObj;

const Chat = (props) => {
  const {
    messageCount,
    setMessageCount,
    profileFilePath,
    contentFilePath,
    dmFilePath,
  } = props;
  const localUserName = localStorage.getItem("username");
  const localUserNickName = localStorage.getItem("userNickname");
  const paramsId = location.search.split("=")[1];
  const [chatCreateModalOn, setChatCreateModalOn] = useState(false); // 채팅 생성 모달 제어
  const [chatStart, setChatStart] = useState(false); // 채팅 시작 여부
  const [roomList, setRoomList] = useState([]); // 채팅방 목록 array
  const [updateChatList, setUpdateChatList] = useState(false);
  const [userInfo, setUserInfo] = useState({}); // 채팅할 상대 정보
  const history = useHistory();
  const webSocketUrl = `ws://www.whereyedo.com:55808/eatstagram/ws/directMessageRoomList/${localUserName}`;
  let ws = useRef(null);

  roomListObj = [...roomList];

  // 새로운 메세지 모달 띄우기
  const onCreateWriteModalHandler = () => {
    setChatCreateModalOn(true);
  };

  // 채팅 시작(채팅 목록 클릭 시)
  const onChatStartHandler = (data, idx) => {
    setUserInfo(data);
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
        url: "directMessageRoomMember/updateConnectionYn",
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
      if (data.type === "createDirectMessageRoom") {
        if (data.newYn === "Y" || data.inYn === "N") {
          let obj = {};
          obj.directMessageRoomId = data.directMessageRoomId;
          obj.directMessageRoomType = data.directMessageRoomType;
          obj.directMessageRoomMemberDTOList = data.userList;
          roomListObj.unshift(obj);
          setRoomList([...roomListObj]);
        } else if (data.newYn === "N") {
          return;
        }
      } else if (data.type === "alert") {
        // db기반 채팅 목록 readYn 제어
        onListReadYnHandler(roomListObj, setRoomList, data);
      }
    };
    return () => {
      console.log("clean up");
      ws.current.close();
    };
  }, []);

  // 유저 리스트에서 읽었는지 안읽었는지 값을 변경해주는 함수
  const onListReadYnHandler = (listObj, set, data) => {
    let listIdx;
    if (listObj.length > 0) {
      // 빈값이면 undefined 때문에 check
      listObj.map((item, idx) => {
        if (data.directMessageRoomId === listObj[idx].directMessageRoomId) {
          listIdx = idx;
          return;
        }
      });
      let unReadList = listObj[listIdx];
      if (listIdx !== undefined) {
        unReadList.alertYn = "Y";
        listObj.splice(listIdx, 1);
        listObj.unshift(unReadList);
        set([...listObj]);
      }
    }
  };

  // 채팅 접속 시 채팅 리스트 업데이트 시켜주는 함수
  const onListUpdateHandler = (listObj, set) => {
    let listIdx;
    if (listObj.length > 0) {
      // 빈값이면 undefined 때문에 check
      listObj.map((item, idx) => {
        if (paramsId === listObj[idx].directMessageRoomId) {
          listIdx = idx;
          return;
        }
      });
      let unReadList = listObj[listIdx];
      if (listIdx !== undefined) {
        listObj.splice(listIdx, 1);
        listObj.unshift(unReadList);
        set([...listObj]);
      }
    }
  };

  useEffect(() => {
    onListUpdateHandler(roomListObj, setRoomList);
    if (updateChatList) {
      setUpdateChatList(false);
    }
  }, [updateChatList]);

  return (
    <>
      <div className="main-area">
        <div className="chat-area">
          <div className="chat-left">
            <div className="chat-me">
              <h1>{localUserNickName}</h1>
              <p onClick={onCreateWriteModalHandler}>
                <FaRegEdit />
              </p>
            </div>
            <div className="chat-list">
              {roomList.map((data, idx) => {
                return (
                  <div
                    className="chatting-list"
                    onClick={() => onChatStartHandler(data, idx)}
                    key={idx}
                  >
                    {data.directMessageRoomMemberDTOList.map((data, idx) => {
                      if (data.username !== localUserName) {
                        return (
                          <div className="chatting-list-box" key={idx}>
                            <div className="chatting-friend">
                              <img
                                src={
                                  data.profileImgName === null
                                    ? profileDefaultImg
                                    : profileFilePath + data.profileImgName
                                }
                                alt=""
                              />
                            </div>
                            <div className="chatting-text" key={idx}>
                              <h1>
                                {data.nickname === null
                                  ? "유저1"
                                  : data.nickname}
                              </h1>
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
            </div>
          </div>
          {chatStart ? (
            <ChatRoom
              paramsId={paramsId}
              setUpdateChatList={setUpdateChatList}
              updateChatList={updateChatList}
              userInfo={userInfo}
              profileFilePath={profileFilePath}
              contentFilePath={contentFilePath}
              dmFilePath={dmFilePath}
            />
          ) : (
            <ChatInitialRightComponent
              onCreateWriteModalHandler={onCreateWriteModalHandler}
            />
          )}
        </div>
      </div>
      <Modal isOpen={chatCreateModalOn} setIsOpen={setChatCreateModalOn}>
        <ChatCreateModal
          setChatCreateModalOn={setChatCreateModalOn}
          ws={ws}
          profileFilePath={profileFilePath}
        />
      </Modal>
    </>
  );
};

export default Chat;
