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
import FollowerModal from "./FollowerModal";
import ProfileImgModal from "./ProfileImgModal";
import { useHistory } from "react-router";
import FollowModal from "./FollowModal";

const Profile = () => {
  const history = useHistory();
  const paramsId = location.search.split("=")[1];
  const localUser = localStorage.getItem("username");
  const [activeBar, setActiveBar] = useState(false);
  const [followerModalOn, setFollowerModalOn] = useState(false); // 팔로워 모달
  const [followModalOn, setFollowModalOn] = useState(false); // 팔로우 모달
  const [follow, setFollow] = useState(""); // 팔로우했는지 여부
  const [follower, setFollower] = useState(""); // 팔로워했는지 여부
  const [followCount, setFollowCount] = useState(""); // 팔로우 수
  const [followerCount, setFollowerCount] = useState(""); // 팔로우 수
  const [profileImgModalOn, setProfileImgModalOn] = useState(false);
  const [profileData, setProfileData] = useState({}); // 프로필 data
  const [posts, setPosts] = useState([]); //게시글
  const [hover, setHover] = useState({}); // 마우스 hover
  const [userImg, setUserImg] = useState(null); // 유저의 이미지

  const onProfileEditBtnClick = () => {
    history.push("/ProfileEdit");
  };
  const onPostMenuClick = () => {
    setActiveBar(false);
  };

  const onSaveMenuClick = () => {
    setActiveBar(true);
  };

  // 팔로워 모달 클릭 시
  const onFollowerModalHandler = () => {
    setFollowerModalOn(true);
  };

  // 팔로우 모달 클릭 시
  const onFollowModalHandler = () => {
    setFollowModalOn(true);
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
  // 팔로우 했는지 여부
  const getFollowYnData = () => {
    fnc.executeQuery({
      url: "follow/getFollowYn",
      data: {
        username: localUser,
        target: paramsId,
      },
      success: (res) => {
        setFollow(res.followYn);
      },
    });
  };

  // 팔로워 했는지 여부
  const getFollowerYnData = () => {
    fnc.executeQuery({
      url: "follower/getFollowerYn",
      data: {
        username: localUser,
        target: paramsId,
      },
      success: (res) => {
        setFollower(res.followerYn);
      },
    });
  };

  // 팔로우 추가 및 삭제
  const sendFollowYnData = () => {
    fnc.executeQuery({
      url: "follow/save",
      data: {
        target: paramsId,
        username: localUser,
      },
      success: (res) => {
        setFollow(res.followYn);
      },
    });
  };
  // 팔로우 수 data불러오기
  const getFollowTotalCount = (user) => {
    fnc.executeQuery({
      url: "follow/getFollowCount",
      data: {
        target: user,
      },
      success: (res) => {
        setFollowCount(res.followCount);
      },
    });
  };

  // 팔로워 수 data불러오기
  const getFollowerTotalCount = (user) => {
    fnc.executeQuery({
      url: "follower/getFollowerCount",
      data: {
        target: user,
      },
      success: (res) => {
        setFollowerCount(res.followerCount);
      },
    });
  };

  // 팔로우& 팔로우 취소 버튼 클릭 시
  const onFollowButtonClick = () => {
    sendFollowYnData();
  };

  useEffect(() => {
    getProfileData(paramsId);
    getFollowTotalCount(paramsId);
    getFollowerTotalCount(paramsId);
    if (localUser !== paramsId) {
      getFollowYnData();
      getFollowerYnData();
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
                    <button onClick={onProfileEditBtnClick}>프로필편집</button>
                  ) : follow === "N" && follower === "Y" ? (
                    <button onClick={() => onFollowButtonClick(data, idx)}>
                      맞팔로우
                    </button>
                  ) : (follow === "Y" && follower === "Y") ||
                    (follow === "Y" && follower === "N") ? (
                    <button onClick={() => onFollowButtonClick(data, idx)}>
                      언팔로우
                    </button>
                  ) : (
                    <button onClick={() => onFollowButtonClick(data, idx)}>
                      팔로우
                    </button>
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
                    onClick={onFollowerModalHandler}
                  >
                    <h2>팔로워</h2>
                    <h3>{followerCount}</h3>
                  </div>
                  <div
                    className="profile-info-li"
                    onClick={onFollowModalHandler}
                  >
                    <h2>팔로우</h2>
                    <h3>{followCount}</h3>
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
              paramsId={paramsId}
            />
          )}
        </div>
      </div>
      <Modal isOpen={followerModalOn} setIsOpen={setFollowerModalOn}>
        <FollowerModal
          localUser={localUser}
          paramsId={paramsId}
          setFollowerModalOn={setFollowerModalOn}
        />
      </Modal>
      <Modal isOpen={followModalOn} setIsOpen={setFollowModalOn}>
        <FollowModal
          localUser={localUser}
          paramsId={paramsId}
          setFollowModalOn={setFollowModalOn}
        />
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
