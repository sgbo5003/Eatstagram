import React from "react";
import Header from "../Header";
import myProfileImg from "../../../public/images/묭수.jpg";
import { FaTh, FaBookmark } from "react-icons/fa";

const Profile = () => {
  return (
    <>
      <Header />
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
                <i className="fas fa-cog"></i>
              </p>
            </div>
            <div className="profile-info__mid">
              <div className="profile-info-li">
                <h2>게시물</h2>
                <h3>3</h3>
              </div>
              <div className="profile-info-li">
                <h2>친구</h2>
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
            <span className="profile-bar-post"></span>
            <p>
              <FaTh />
            </p>
            <p>게시물</p>
          </div>
          <div className="profile-area-border-li">
            <span className="profile-bar-bookmark"></span>
            <p>
              <FaBookmark />
            </p>
            <p>저장됨</p>
          </div>
        </div>
        <div className="profile-area-bottom">
          <div className="profile-area__post">
            <img src="./images/food.jpg" alt="" />
            <img src="./images/food.jpg" alt="" />
            <img src="./images/food.jpg" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
