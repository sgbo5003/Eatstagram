import React from "react";
import { FaEllipsisH, FaTimes } from "react-icons/fa";

const SubscribeModal = () => {
  return (
    <div className="subs-window">
      <div className="subs-area">
        <div className="subs__top">
          <h6></h6>
          <h4>구독</h4>
          <p>
            <FaTimes />
          </p>
        </div>
        <div className="subs__bottom">
          <div className="subs-list-area">
            <div className="subs-list">
              <div className="subs-user">
                <img src="./images/명수스토리.jpg" alt="" />
                <h4>whereyedo</h4>
                <h5>진예도</h5>
              </div>
              <div className="subs-cancle">
                <button>구독취소</button>
              </div>
            </div>
            <div className="subs-list">
              <div className="subs-user">
                <img src="./images/명수스토리7.jpg" alt="" />
                <h4>ParkSangJun</h4>
                <h5>박상준</h5>
              </div>
              <div className="subs-cancle">
                <button>구독취소</button>
              </div>
            </div>
            <div className="subs-list">
              <div className="subs-user">
                <img src="./images/명수스토리6.jpg" alt="" />
                <h4>haha</h4>
                <h5>하하</h5>
              </div>
              <div className="subs-cancle">
                <button>구독취소</button>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default SubscribeModal;
