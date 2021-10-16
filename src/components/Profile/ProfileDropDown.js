import React from "react";
import { FaUserCircle, FaBookmark, FaCog } from "react-icons/fa";
import { useHistory } from "react-router";
import tailImg from "../../../public/images/tail.png";
const ProfileDropDown = (props) => {
  const { onProfileClick, setDropDown } = props;
  const history = useHistory();

  const onSettingClick = () => {
    history.push("/ProfileEdit");
    setDropDown(false);
  };

  const onLogOutClick = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userNickname");
    location.reload();
  };
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

        <div className="user-dropdown-li" onClick={onSettingClick}>
          <p>
            <FaCog />
          </p>
          <p>설정</p>
        </div>
        <div className="user-dropdown-logout" onClick={onLogOutClick}>
          <p>로그아웃</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropDown;
