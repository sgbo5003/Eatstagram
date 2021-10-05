import React, { useEffect } from "react";
import * as fncObj from "../../commonFunc/CommonObjFunctions";

const ChatExitModal = (props) => {
  const localUserName = localStorage.getItem("username");
  const { setChatExitModalOn, paramsId } = props;

  const onRoomOutData = () => {
    fncObj.executeQuery({
      url: "directMessageRoom/out",
      data: {
        directMessageRoomId: paramsId,
        username: localUserName,
      },
      success: (res) => {},
    });
  };

  const onExitBtnHandler = () => {
    onRoomOutData();
    setChatExitModalOn(false);
  };

  const onCancelBtnHandler = () => {
    setChatExitModalOn(false);
  };

  return (
    <div className="write-delete-window">
      <div className="write-delete-area">
        <div className="write-delte__top">
          <h1>채팅방을 나가시겠어요?</h1>
          <h4>지금 나가면 채팅 내용이 모두 사라집니다.</h4>
        </div>
        <div className="write-delete__bottom">
          <div className="chat-delete-btn">
            <button onClick={onExitBtnHandler}>나가기</button>
          </div>
          <div className="chat-cancle-btn">
            <button onClick={onCancelBtnHandler}>취소</button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ChatExitModal;
