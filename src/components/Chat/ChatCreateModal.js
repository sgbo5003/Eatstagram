import React, { useEffect, useState } from "react";
import storyProfileImg1 from "../../../public/images/명수스토리.jpg";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import * as fnc from "../../commonFunc/CommonFunctions";
import { useHistory } from "react-router";
import { FaTimes } from "react-icons/fa";

const ChatCreateModal = (props) => {
  const { setChatCreateModalOn, ws } = props;
  const history = useHistory();
  const [inputText, setInputText] = useState("");
  const [userList, setUserList] = useState([]);
  const [userChecked, setUserChecked] = useState("");
  const localUser = localStorage.getItem("username");

  // input 입력값
  const onInputTextHandler = (e) => {
    setInputText(e.target.value);
    if (e.target.value === "" || e.target.value.trim() === "") {
      return;
    } else {
      getUserSearchData(e);
    }
  };

  // 유저 입력값 조회
  const getUserSearchData = (e) => {
    fncObj.executeQuery({
      url: "getListByNameAndNickname",
      data: {
        condition: e.target.value,
        username: localUser,
      },
      success: (res) => {
        setUserList(res);
      },
    });
  };

  const onUserCheckHandler = (data) => {
    setUserChecked(data.username);
  };

  const onSubmit = () => {
    ws.current.send(
      JSON.stringify({
        roomType: "directMessageRoomList",
        userList: [localUser, userChecked],
      })
    );
    setChatCreateModalOn(false);
  };

  const onExitModalHandler = () => {
    setChatCreateModalOn(false);
  };

  return (
    <div className="chat-start-window">
      <div className="chat-start-area">
        <div className="chat-start__top">
          <p>
            <FaTimes onClick={onExitModalHandler} />
          </p>
          <h4>새로운 메시지</h4>
          <h2 onClick={onSubmit}>초대</h2>
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
            {userList.map((data, idx) => {
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
                    checked={userChecked === data.username ? true : false}
                    onClick={() => onUserCheckHandler(data)}
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

export default ChatCreateModal;
