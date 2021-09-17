import React, { useState } from "react";
import {
  FaEdit,
  FaRegEdit,
  FaInfoCircle,
  FaImage,
  FaRegImage,
  FaHeart,
  FaRegHeart,
  FaArrowUp,
} from "react-icons/fa";
import storyProfileImg1 from "../images/명수스토리.jpg";

const Chat = () => {
  const [inputText, setInputText] = useState(""); // input 부분
  const [chatBox, setChatBox] = useState([]); // 메세지를 담는 배열

  const onInputTextHandler = (e) => {
    setInputText(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e.key == "Enter") {
      if (inputText === "") {
        return;
      } else {
        // 값이 있으면 chatBox 배열에 inputText 추가
        setChatBox(chatBox.concat(inputText));
      }
      // 채팅을 보내면 input 비워주기
      setInputText("");
    }
  };

  return (
    <div className="service-screen">
      <div className="main-area">
        <div className="chat-area">
          <div className="chat-top">
            <div className="chat-me">
              <h1>gyuxxr</h1>
              <p>
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
                  <FaInfoCircle />
                </p>
              </div>
            </div>
          </div>
          <div className="chat-bottom">
            <div className="chat-left">
              <div className="chat-list">
                <div className="chatting-list">
                  <div className="chatting-friend">
                    <img src={storyProfileImg1} alt="" />
                  </div>
                  <div className="chatting-text">
                    <h1>whereyedo</h1>
                    <h4>안녕 안녕 안녕</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="chat-right">
              <div className="chatting-area">
                <h4>2021년 9월 17일</h4>
                {chatBox.map((data, idx) => {
                  return (
                    <div className="my-message" key={idx}>
                      <p>{data}</p>
                    </div>
                  );
                })}
                {/*내 메세지*/}
                {/* <div className="my-message">
                  <p>안녕 안녕 안녕</p>
                </div> */}
                {/*친구 메세지*/}
                {/* <div className="friend-message">
                  <img src={storyProfileImg1} alt="" />
                  <p>안녕 안녕 안녕</p>
                </div> */}
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
  );
};

export default Chat;
