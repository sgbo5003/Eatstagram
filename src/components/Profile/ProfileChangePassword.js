import React, { useEffect, useState } from "react";
import ProfileEditSidebar from "./ProfileEditSidebar";
import * as fncObj from "../../commonFunc/CommonObjFunctions";

const ProfileChangePassword = () => {
  const localUser = localStorage.getItem("username");
  const [profileData, setProfileData] = useState({}); // 프로필 data
  const [inputData, setInputData] = useState({
    previewPwd: "",
    newPwd: "",
    confirmNewPwd: "",
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
            </div>
          </div>
          <div className="edit-right-li">
            <aside>
              <label htmlFor="password">이전 비밀번호</label>
            </aside>
            <div className="edit-right-li__input">
              <input
                type="password"
                name="previewPwd"
                value={inputData.previewPwd}
                onChange={onChangeInputHandler}
              />
            </div>
          </div>
          <div className="edit-right-li">
            <aside>
              <label htmlFor="userid">새 비밀번호</label>
            </aside>
            <div className="edit-right-li__input">
              <input
                type="password"
                name="newPwd"
                value={inputData.newPwd}
                onChange={onChangeInputHandler}
              />
            </div>
          </div>
          <div className="edit-right-li">
            <aside>
              <label htmlFor="usertext">새 비밀번호 확인</label>
            </aside>
            <div className="edit-right-li__input">
              <input
                type="password"
                name="confirmNewPwd"
                value={inputData.confirmNewPwd}
                onChange={onChangeInputHandler}
              />
            </div>
          </div>
          <div className="edit-right-li edit-btn">
            <aside></aside>
            <div className="edit-right-li__btn">
              <button>비밀번호 변경</button>
              <a href="./findpw.html">
                <h4>비밀번호를 잊으셨나요?</h4>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileChangePassword;
