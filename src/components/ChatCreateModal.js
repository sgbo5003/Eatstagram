import React, { useEffect, useState } from "react";
import storyProfileImg1 from "../../public/images/명수스토리.jpg";
import * as fncObj from "../commonFunc/CommonObjFunctions";
import { VscLoading } from "react-icons/vsc";
import * as fnc from "../commonFunc/CommonFunctions";
import { useHistory } from "react-router";

const ChatCreateModal = (props) => {
  const { setChatCreateModalOn } = props;
  const history = useHistory();
  const [inputText, setInputText] = useState("");
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [userChecked, setUserChecked] = useState("");
  const localUser = localStorage.getItem("username");

  // input 입력값
  const onInputTextHandler = (e) => {
    setInputText(e.target.value);
    if (inputText === "") {
      return;
    } else {
      console.log(inputText);
      getUserSearchData();
    }
  };

  // 유저 입력값 조회
  const getUserSearchData = () => {
    fncObj.executeQuery({
      url: "getListByNameAndNickname",
      data: {
        condition: inputText,
        username: localUser,
      },
      success: (res) => {
        setUserList(res);
      },
    });
  };

  const onUserCheckHandler = (data) => {
    setUserChecked(data.username);
    console.log(userChecked);
  };

  const onSubmit = () => {
    fnc.executeQuery({
      url: "directMessageRoom/add",
      data: {
        "directMessageRoomMemberDTOList[0].username": localUser,
        "directMessageRoomMemberDTOList[1].username": userChecked,
      },
      success: (res) => {
        setChatCreateModalOn(false);
        location.reload();
      },
    });
  };

  return (
    <div className="chat-start-window">
      <div className="chat-start-area">
        <div className="chat-start__top">
          <p>
            <i className="fas fa-times"></i>
          </p>
          <h4>새로운 메시지</h4>
          <h2 onClick={onSubmit}>초대</h2>
        </div>
        <div className="chat-start__middle">
          <h4>받는 사람 :</h4>
          <input
            type="text"
            placeholder="검색..."
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
