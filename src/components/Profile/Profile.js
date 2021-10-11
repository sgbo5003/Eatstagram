import React, { useEffect, useState } from "react";
import Header from "../Header";
import myProfileImg from "../../../public/images/묭수.jpg";
import profileDefaultImg from "../../../public/images/default_user.png";
import { FaTh, FaBookmark, FaCog } from "react-icons/fa";
import ProfileSave from "./ProfileSave";
import ProfilePost from "./ProfilePost";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import * as fnc from "../../commonFunc/CommonFunctions";
import Modal from "../../Modal";
import SubscribeModal from "./SubscribeModal";
import ProfileImgModal from "./ProfileImgModal";

const Profile = () => {
  const paramsId = location.search.split("=")[1];
  const localUser = localStorage.getItem("username");
  const [activeBar, setActiveBar] = useState(false);
  const [subscribeModalOn, setSubscribeModalOn] = useState(false);
  const [subscribe, setSubscribe] = useState("");
  const [profileImgModalOn, setProfileImgModalOn] = useState(false);
  const [profileData, setProfileData] = useState({}); // 프로필 data
  const [posts, setPosts] = useState([]); //게시글
  const [hover, setHover] = useState({}); // 마우스 hover
  const [userImg, setUserImg] = useState(null); // 유저의 이미지

  const onPostMenuClick = () => {
    setActiveBar(false);
  };

  const onSaveMenuClick = () => {
    setActiveBar(true);
  };

  const onSubscribeModalHandler = () => {
    setSubscribeModalOn(true);
  };

  const onProfileImgClick = () => {
    if (paramsId === localUser) setProfileImgModalOn(true);
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
  // 프로필 data 불러오기
  const getProfileData = (user) => {
    fncObj.executeQuery({
      url: "getMemberInfo",
      data: {
        username: user,
      },
      success: (res) => {
        setProfileData(res);
      },
    });
  };
  // 게시글 data 불러오기
  const getData = () => {
    fncObj.executeQuery({
      url: "content/getMyPagingList",
      data: {
        page: 0,
        size: 6,
        username: paramsId,
      },
      success: (res) => {
        setPosts(res.content);
      },
    });
  };
  // 프로필 구독 했는지 여부
  const getSubscriptionYnData = () => {
    fnc.executeQuery({
      url: "subscription/getSubscriptionYn",
      data: {
        username: localUser,
        subscriber: paramsId,
      },
      success: (res) => {
        setSubscribe(res.subscriptionYn);
      },
    });
  };

  const onSubscribeClick = () => {
    sendSubscriptionYnData();
    subscribe === "Y" ? setSubscribe("N") : setSubscribe("Y");
  };
  // 구독 추가 및 삭제
  const sendSubscriptionYnData = () => {
    fnc.executeQuery({
      url: "subscription/save",
      data: {
        username: localUser,
        subscriber: paramsId,
      },
      success: (res) => {},
    });
  };

  useEffect(() => {
    getProfileData(paramsId);
    if (localUser !== paramsId) {
      getSubscriptionYnData();
    }
  }, []);
  return (
    <>
      <div className="profile-area">
        {[profileData].map((data, idx) => {
          return (
            <div className="profile-area-top" key={idx}>
              <div className="profile-img" onClick={onProfileImgClick}>
                <img
                  src={
                    data.profileImgName === null
                      ? profileDefaultImg
                      : `upload/profile/${data.profileImgName}`
                  }
                  alt=""
                />
              </div>
              <div className="profile-info">
                <div className="profile-info__top">
                  <h1>{data.nickname}</h1>
                  {paramsId === localUser ? (
                    <button>프로필편집</button>
                  ) : subscribe === "Y" ? (
                    <button onClick={onSubscribeClick}>구독중</button>
                  ) : (
                    <button onClick={onSubscribeClick}>구독하기</button>
                  )}
                  {paramsId === localUser ? (
                    <p>
                      <FaCog />
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="profile-info__mid">
                  <div className="profile-info-li">
                    <h2>게시물</h2>
                    <h3>{posts.length}</h3>
                  </div>
                  <div
                    className="profile-info-li"
                    onClick={onSubscribeModalHandler}
                  >
                    <h2>구독</h2>
                    <h3>90</h3>
                  </div>
                </div>
                <div className="profile-info__bottom">
                  <h2>{data.name}</h2>
                  <h3>소개입니다~</h3>
                </div>
              </div>
            </div>
          );
        })}

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
            <ProfileSave
              posts={posts}
              setPosts={setPosts}
              hover={hover}
              setHover={setHover}
              onMouseOverHandler={onMouseOverHandler}
              onMouseOutHandler={onMouseOutHandler}
              paramsId={paramsId}
            />
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
        <SubscribeModal localUser={localUser} paramsId={paramsId} />
      </Modal>
      <Modal isOpen={profileImgModalOn} setIsOpen={setProfileImgModalOn}>
        <ProfileImgModal
          userImg={userImg}
          setUserImg={setUserImg}
          setProfileImgModalOn={setProfileImgModalOn}
        />
      </Modal>
    </>
  );
};

export default Profile;
