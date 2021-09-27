import React from "react";
import { FaUserCircle, FaBookmark, FaCog } from "react-icons/fa";
import tailImg from "../../../public/images/tail.png";
const ProfileDropDown = (props) => {
  const { onProfileClick } = props;
  return (
    <div className="user-dropdown">
      <div className="user-dropdown-tail">
        <img src={tailImg} alt="" />
      </div>
      <div className="user-dropdown-window">
        <div className="user-dropdown-li" onClick={onProfileClick}>
          <p>
            <FaUserCircle />
          </p>
          <p>프로필</p>
        </div>
        <div className="user-dropdown-li">
          <p>
            <FaBookmark />
          </p>
          <p>저장됨</p>
        </div>
        <div className="user-dropdown-li">
          <p>
            <FaCog />
          </p>
          <p>설정</p>
        </div>
        <div className="user-dropdown-logout">
          <p>로그아웃</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropDown;
