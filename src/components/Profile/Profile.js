import React, { useEffect, useState } from "react";
import Header from "../Header";
import myProfileImg from "../../../public/images/묭수.jpg";
import { FaTh, FaBookmark, FaCog } from "react-icons/fa";
import ProfileSave from "./ProfileSave";
import ProfilePost from "./ProfilePost";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import Modal from "../../Modal";
import SubscribeModal from "./SubscribeModal";

const Profile = () => {
  const localUser = localStorage.getItem("username");
  const localUserNickName = localStorage.getItem("userNickname");
  const [activeBar, setActiveBar] = useState(false);
  const [subscribeModalOn, setSubscribeModalOn] = useState(false);
  const [profileData, setProfileData] = useState({}); // 프로필 data
  const [posts, setPosts] = useState([]); //게시글
  const [hover, setHover] = useState({}); // 마우스 hover

  const onPostMenuClick = () => {
    setActiveBar(false);
  };

  const onSaveMenuClick = () => {
    setActiveBar(true);
  };

  const onSubscribeClick = () => {
    setSubscribeModalOn(true);
  };
  // 게시글 마우스 Over시
  const onMouseOverHandler = (data, idx) => {
    if (data.location === posts[idx].location) {
      setHover({ location: data.location });
    }
  };
  // 게시글 마우스 Out시
  const onMouseOutHandler = () => {
    setHover({});
  };

  const getProfileData = () => {
    fncObj.executeQuery({
      url: "getMemberInfo",
      data: {
        username: localUser,
      },
      success: (res) => {
        setProfileData(res);
      },
    });
  };

  const getData = () => {
    fncObj.executeQuery({
      url: "content/getMyPagingList",
      data: {
        page: 0,
        size: 6,
        username: localUser,
      },
      success: (res) => {
        setPosts(res.content);
      },
    });
  };

  useEffect(() => {
    getProfileData();
  }, []);
  return (
    <>
      <div className="profile-area">
        <div className="profile-area-top">
          <div className="profile-img">
            <img src={myProfileImg} alt="" />
          </div>
          <div className="profile-info">
            <div className="profile-info__top">
              <h1>{profileData.nickname}</h1>
              <button>프로필편집</button>
              <p>
                <FaCog />
              </p>
            </div>
            <div className="profile-info__mid">
              <div className="profile-info-li">
                <h2>게시물</h2>
                <h3>{posts.length}</h3>
              </div>
              <div className="profile-info-li" onClick={onSubscribeClick}>
                <h2>구독</h2>
                <h3>90</h3>
              </div>
            </div>
            <div className="profile-info__bottom">
              <h2>{profileData.name}</h2>
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
          {activeBar ? (
            <ProfileSave />
          ) : (
            <ProfilePost
              posts={posts}
              setPosts={setPosts}
              getData={getData}
              hover={hover}
              setHover={setHover}
              onMouseOverHandler={onMouseOverHandler}
              onMouseOutHandler={onMouseOutHandler}
            />
          )}
        </div>
      </div>
      <Modal isOpen={subscribeModalOn} setIsOpen={setSubscribeModalOn}>
        <SubscribeModal />
      </Modal>
    </>
  );
};

export default Profile;
