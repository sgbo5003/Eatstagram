import React, { useState } from "react";
import Header from "../Header";
import myProfileImg from "../../../public/images/묭수.jpg";
import { FaTh, FaBookmark, FaCog } from "react-icons/fa";
import ProfileSave from "./ProfileSave";
import ProfilePost from "./ProfilePost";

const Profile = () => {
  const [activeBar, setActiveBar] = useState(false);

  const onPostMenuClick = () => {
    setActiveBar(false);
  };

  const onSaveMenuClick = () => {
    setActiveBar(true);
  };
  return (
    <>
      <div className="profile-area">
        <div className="profile-area-top">
          <div className="profile-img">
            <img src={myProfileImg} alt="" />
          </div>
          <div className="profile-info">
            <div className="profile-info__top">
              <h1>gyuxxr</h1>
              <button>프로필편집</button>
              <p>
                <FaCog />
              </p>
            </div>
            <div className="profile-info__mid">
              <div className="profile-info-li">
                <h2>게시물</h2>
                <h3>3</h3>
              </div>
              <div className="profile-info-li">
                <h2>구독</h2>
                <h3>90</h3>
              </div>
            </div>
            <div className="profile-info__bottom">
              <h2>배규리</h2>
              <h3>소개입니다~</h3>
            </div>
          </div>
        </div>

        <div className="profile-area-border">
          <div className="profile-area-border-li">
            {activeBar ? "" : <span className="profile-bar-post"></span>}
            <p>
              <FaTh />
            </p>
            <p onClick={onPostMenuClick}>게시물</p>
          </div>
          <div className="profile-area-border-li">
            {activeBar ? <span className="profile-bar-post"></span> : ""}
            <p>
              <FaBookmark />
            </p>
            <p onClick={onSaveMenuClick}>저장됨</p>
          </div>
        </div>
        <div className="profile-area-bottom">
          {activeBar ? <ProfileSave /> : <ProfilePost />}
        </div>
      </div>
    </>
  );
};

export default Profile;
