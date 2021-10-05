import React from "react";
import storyProfileImg1 from "../../../public/images/명수스토리.jpg";
import { FaTimes } from "react-icons/fa";

const SharemModal = (props) => {
  const { setShareModalOn } = props;
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
          <h2>보내기</h2>
        </div>
        <div className="chat-start__middle">
          <h4>받는 사람 :</h4>
          <div className="recommend-friend">
            <div className="recommend-friend-btn">
              <h4>whereyedo</h4>
              <p>x</p>
            </div>
          </div>
          <input type="text" placeholder="검색..." />
        </div>
        <div className="chat-start__bottom">
          <div className="chat-recommend">
            <h4>추천</h4>
          </div>
          <div className="chat-recommend-area">
            <div className="recommend-list">
              <div className="recommend-user">
                <img src={storyProfileImg1} alt="" />
                <h4>whereyedo</h4>
              </div>
              <input type="radio" />
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default SharemModal;
