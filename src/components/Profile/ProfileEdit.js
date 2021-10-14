import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ProfileEditSidebar from "./ProfileEditSidebar";
import * as fncObj from "../../commonFunc/CommonObjFunctions";

const ProfileEdit = (props) => {
  const location = useLocation();
  const localUser = localStorage.getItem("username");
  const [profileData, setProfileData] = useState({}); // 프로필 data
  const [inputData, setInputData] = useState({
    name: "",
    username: "",
    introduce: "",
  });
  // 프로필 data 불러오기
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
  useEffect(() => {
    getProfileData();
  }, []);

  //input 값 감지 함수
  const onChangeInputHandler = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };
  return (
    <div className="main-area">
      <div className="edit-area">
        <ProfileEditSidebar />
        <div className="edit-right">
          <div className="edit-right-li">
            <aside>
              <img src="./images/묭수.jpg" alt="" />
            </aside>
            <div className="edit-right-li__input">
              <h1>{profileData.nickname}</h1>
              <button>프로필 사진 바꾸기</button>
            </div>
          </div>
          <div className="edit-right-li">
            <aside>
              <label htmlFor="username">이름</label>
            </aside>
            <div className="edit-right-li__input">
              <input
                type="text"
                placeholder="이름"
                name="name"
                defaultValue={profileData.name}
                onChange={onChangeInputHandler}
              />
              <p>
                사람들이 이름, 별명 또는 비즈니스 이름 등 회원님의 알려진 이름을
                <br />
                사용하여 회원님의 계정을 찾을 수 있도록 도와주세요.
              </p>
            </div>
          </div>
          <div className="edit-right-li">
            <aside>
              <label htmlFor="userid">아이디</label>
            </aside>
            <div className="edit-right-li__input">
              <input
                type="text"
                name="username"
                placeholder="아이디를 입력해주세요"
                defaultValue={profileData.nickname}
                onChange={onChangeInputHandler}
              />
            </div>
          </div>
          <div className="edit-right-li">
            <aside>
              <label htmlFor="usertext">소개</label>
            </aside>
            <div className="edit-right-li__input introduce">
              <textarea name="" id="" cols="30" rows="10"></textarea>
            </div>
          </div>
          <div className="edit-right-li edit-btn">
            <aside></aside>
            <div className="edit-right-li__btn">
              <button>변경하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;