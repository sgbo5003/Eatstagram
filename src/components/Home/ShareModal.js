import React, { useEffect, useState } from "react";
import storyProfileImg1 from "../../../public/images/명수스토리.jpg";
import { FaTimes } from "react-icons/fa";
import * as fncObj from "../../commonFunc/CommonObjFunctions";

const ShareModal = (props) => {
  const { setShareModalOn, ws, contentId, contentFile, webSocketUrl } = props;
  const [inputText, setInputText] = useState("");
  const [list, setList] = useState([]);
  const [checked, setChecked] = useState({ username: "", roomId: "" });
  const localUser = localStorage.getItem("username");

  // input 입력값
  const onInputTextHandler = (e) => {
    console.log(e.target.value);
    setInputText(e.target.value);
    if (e.target.value === "" || e.target.value.trim() === "") {
      return;
    } else {
      getUserSearchData(e);
    }
  };

  // 채팅방 목록 불러오기
  const getChatList = () => {
    fncObj.executeQuery({
      url: "directMessageRoom/getList",
      data: {
        username: localUser,
      },
      success: (res) => {
        const list = [...res];
        list.map((item) => {
          item.type = "roomList";
        });
        setList(list);
      },
    });
  };

  const onUserCheckHandler = (data) => {
    const obj = {};
    obj.username = data.username;
    console.log("obj", obj);
    setChecked(obj);
    console.log("checked", checked);
  };

  const onRoomCheckHandler = (data) => {
    const obj = { ...checked };
    obj.roomId = data.directMessageRoomId;
    obj.username = data.directMessageRoomMemberDTOList[0].username;
    setChecked({ ...obj });
    console.log("checked", checked);
  };

  // 보내기 버튼 제어
  const onSubmit = () => {
    ws.current.send(
      JSON.stringify({
        username: localUser,
        msg: contentId,
        roomType: "directMessage",
        roomId: checked.roomId || null,
        type: "share",
        shareData: {
          thumbnail: contentFile,
          userList: [localUser, checked.username],
        },
      })
    );
    setShareModalOn(false);
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
        const list = [...res];
        list.map((item) => {
          item.type = "userList";
        });
        setList(list);
      },
    });
  };

  // 나가기 버튼 제어
  const onExitModalHandler = () => {
    setShareModalOn(false);
  };

  useEffect(() => {
    getChatList();
    const webSocketUrl = `ws://localhost:8080/eatstagram/ws/contentReply/${contentId}`;
    ws.current = new WebSocket(webSocketUrl);
  }, []);

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
              if (data.type === "roomList") {
                return (
                  <div className="recommend-list" key={idx}>
                    {data.directMessageRoomMemberDTOList.map((data, idx) => {
                      return (
                        <div className="recommend-user" key={idx}>
                          <img src={storyProfileImg1} alt="" />
                          <div className="recommend-user-nameBox">
                            <h4>
                              {data.nickname === null ? "유저1" : data.nickname}
                            </h4>
                            <h6>{data.name}</h6>
                          </div>
                        </div>
                      );
                    })}
                    <input
                      type="radio"
                      checked={
                        checked.username ===
                        data.directMessageRoomMemberDTOList[0].username
                          ? true
                          : false
                      }
                      onClick={() => onRoomCheckHandler(data)}
                      readOnly
                    />
                  </div>
                );
              } else if (data.type === "userList") {
                return (
                  <div className="recommend-list" key={idx}>
                    <div className="recommend-user" key={idx}>
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
                      checked={
                        checked.username === data.username ? true : false
                      }
                      onClick={() => onUserCheckHandler(data)}
                      readOnly
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
