import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import profileDefaultImg from "../../../public/images/default_user.png";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import Modal from "../../Modal";
import ProfileChangePassword from "./ProfileChangePassword";
import ProfileEditPage from "./ProfileEditPage";
import ProfileImgModal from "./ProfileImgModal";

const ProfileEdit = (props) => {
  const { profileFilePath } = props;
  const location = useLocation();
  const localUser = localStorage.getItem("username");
  const [editPage, setEditPage] = useState(false);
  const [profileData, setProfileData] = useState({}); // 프로필 data

  // 프로필 편집 메뉴 click
  const ProfileEditMenuClick = () => {
    setEditPage(false);
  };

  // 비밀번호 변경 click
  const PasswordChangeMenuClick = () => {
    setEditPage(true);
  };

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

  return (
    <div className="main-area">
      <div className="edit-area">
        <div className="edit-left">
          {profileData.formSocial ? (
            <>
              <div className="edit-list checked">
                <p>프로필 편집</p>
              </div>
            </>
          ) : (
            <>
              <div className={`edit-list ${editPage ? "" : "checked"}`}>
                <p onClick={ProfileEditMenuClick}>프로필 편집</p>
              </div>
              <div className={`edit-list ${editPage ? "checked" : ""}`}>
                <p onClick={PasswordChangeMenuClick}>비밀번호 변경</p>
              </div>
            </>
          )}
        </div>
        <div className="edit-right">
          {editPage ? (
            <ProfileChangePassword
              profileData={profileData}
              localUser={localUser}
              profileFilePath={profileFilePath}
            />
          ) : (
            <ProfileEditPage
              profileData={profileData}
              setProfileData={setProfileData}
              localUser={localUser}
              profileFilePath={profileFilePath}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
