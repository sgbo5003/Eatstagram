import React, { useEffect, useRef, useState } from "react";
import {
  FaEdit,
  FaRegEdit,
  FaImage,
  FaRegImage,
  FaHeart,
  FaRegHeart,
  FaArrowUp,
} from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import storyProfileImg1 from "../images/명수스토리.jpg";
import * as fncObj from "../commonFunc/CommonObjFunctions";
import Modal from "../Modal";
import ChatCreateModal from "./ChatCreateModal";

const userList = [
  {
    username: "유저1",
    message: "채팅1",
  },
  {
    username: "유저2",
    message: "채팅2",
  },
  {
    username: "유저3",
    message: "채팅3",
  },
  {
    username: "유저4",
    message: "채팅4",
  },
];

const Chat = () => {
  const webSocketUrl = `ws://localhost:8080/ws/directMessage/1`;
  const localUserName = localStorage.getItem("username");
  let ws = useRef(null);
  const messagesEndRef = useRef(null);
  const [inputText, setInputText] = useState(""); // input 부분
  const [myChatBox, setMyChatBox] = useState([]); // 나의 메세지를 담는 배열
  const [friendChatBox, setFriendChatBox] = useState([]); // 상대 메세지를 담는 배열
  const [chatList, setChatList] = useState([]); // 받아온 채팅 리스트
  const [roomList, setRoomList] = useState([]); // 채팅 목록 리스트
  const [chatCreateModalOn, setChatCreateModalOn] = useState(false);

  // 채팅 입력
  const onInputTextHandler = (e) => {
    setInputText(e.target.value);
  };

  // 채팅 입력 (Enter키)
  const onKeyPress = (e) => {
    if (e.key == "Enter") {
      if (inputText === "") {
        return;
      } else {
        // 값이 있으면 chatBox 배열에 inputText 추가
        ws.current.send(
          JSON.stringify({
            msg: inputText,
            type: "text",
            roomType: "directMessage",
            roomId: "1",
            username: localUserName,
          })
        );
      }
      // 채팅을 보내면 input 비워주기
      setInputText("");
    }
  };

  useEffect(() => {
    ws.current = new WebSocket(webSocketUrl);
    ws.current.onopen = () => {
      console.log("connected to " + webSocketUrl);
      getChatData();
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
      setMyChatBox((prevItems) => [...prevItems, data]);
    };
    return () => {
      console.log("clean up");
      ws.current.close();
    };
  }, []);

  // 채팅 가져오기
  const getChatData = () => {
    fncObj.executeQuery({
      url: "directMessage/getPagingList",
      data: {
        page: 0,
        size: 12,
        directMessageRoomId: "1",
      },
      success: (res) => {
        setChatList(res.content);
      },
    });
  };

  const onCreateWriteModalHandler = () => {
    setChatCreateModalOn(true);
  };

  return (
    <>
      <div className="service-screen">
        <div className="main-area">
          <div className="chat-area">
            <div className="chat-top">
              <div className="chat-me">
                <h1>gyuxxr</h1>
                <p onClick={onCreateWriteModalHandler}>
                  <FaRegEdit />
                </p>
              </div>
              <div className="chat-friend">
                <div className="chat-friend__user">
                  <img src={storyProfileImg1} alt="" />
                  <h5>whereyedo</h5>
                </div>
                <div className="chat-info-btn">
                  <p>
                    <BsInfoCircle />
                  </p>
                </div>
              </div>
            </div>
            <div className="chat-bottom">
              <div className="chat-left">
                <div className="chat-list">
                  {userList.map((data, idx) => {
                    return (
                      <div className="chatting-list" key={idx}>
                        <div className="chatting-friend">
                          <img src={storyProfileImg1} alt="" />
                        </div>
                        <div className="chatting-text">
                          <h1>{data.username}</h1>
                          <h4>{data.message}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="chat-right">
                <div className="chatting-area">
                  <h4>2021년 9월 17일</h4>
                  {chatList
                    .slice(0)
                    .reverse()
                    .map((data, idx) => {
                      if (data.username === localUserName) {
                        return (
                          <div className="my-message" key={idx}>
                            <p>{data.directMessage}</p>
                          </div>
                        );
                      } else {
                        return (
                          <div className="friend-message" key={idx}>
                            <img src={storyProfileImg1} alt="" />
                            <p>{data.directMessage}</p>
                          </div>
                        );
                      }
                    })}
                  {myChatBox.map((data, idx) => {
                    return (
                      <div className="my-message" key={idx}>
                        <p>{data.msg}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="input-message">
                  <input
                    type="text"
                    placeholder="메세지 입력..."
                    value={inputText}
                    onChange={onInputTextHandler}
                    onKeyPress={onKeyPress}
                  />
                  <p>
                    <FaRegImage />
                  </p>
                  <p>
                    <FaRegHeart />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={chatCreateModalOn} setIsOpen={setChatCreateModalOn}>
        <ChatCreateModal />
      </Modal>
    </>
  );
};

export default Chat;
