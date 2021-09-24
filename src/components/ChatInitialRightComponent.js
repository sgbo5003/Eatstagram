import React from "react";
import { IoPaperPlaneOutline } from "react-icons/io5";

const ChatInitialRightComponent = (props) => {
  const { onCreateWriteModalHandler } = props;
  return (
    <div className="chat-right">
      <div className="chat-space">
        <p>
          <IoPaperPlaneOutline />
        </p>
        <h1>내 메시지</h1>
        <h5>친구에게 메시지를 보내보세요.</h5>
        <button onClick={onCreateWriteModalHandler}>메시지보내기</button>
      </div>
    </div>
  );
};

export default ChatInitialRightComponent;
