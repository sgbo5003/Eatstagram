import React, { useState } from "react";
import storyProfileImg1 from "../../../public/images/명수스토리.jpg";
import { FaTimes } from "react-icons/fa";

const SharemModal = (props) => {
  const { setShareModalOn } = props;
  const [inputText, setInputText] = useState("");
  const [list, setList] = useState([]);
  const [checked, setChecked] = useState("");

  // input 입력값
  const onInputTextHandler = (e) => {
    setInputText(e.target.value);
    if (e.target.value === "" || e.target.value === "") {
      return;
    } else {
    }
  };

  // 보내기 버튼 제어
  const onSubmit = () => {};
  // 나가기 버튼 제어
  const onExitModalHandler = () => {
    setShareModalOn(false);
  };

  return (
    <div className="chat-start-window">
      <div className="chat-start-area">
        <div className="chat-start__top">
          <p>
            <FaTimes onClick={onExitModalHandler} />
          </p>
          <h4>공유</h4>
          <h2 onClick={onSubmit}>보내기</h2>
        </div>
        <div className="chat-start__middle">
          <h4>받는 사람 :</h4>
          <input
            type="text"
            placeholder="검색..."
            value={inputText}
            onChange={onInputTextHandler}
          />
        </div>
        <div className="chat-start__bottom">
          <div className="chat-recommend">
            <h4>추천</h4>
          </div>
          <div className="chat-recommend-area">
            {list.map((data, idx) => {
              return (
                <div className="recommend-list" key={idx}>
                  <div className="recommend-user">
                    <img src={storyProfileImg1} alt="" />
                    <div className="recommend-user-nameBox">
                      <h4>
                        {data.nickname === null ? "유저1" : data.nickname}
                      </h4>
                      <h6>{data.name}</h6>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={checked === data.username ? true : false}
                    readOnly
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharemModal;
