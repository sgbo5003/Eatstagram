import React, { useState } from "react";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
const ProfileImgModal = (props) => {
  const localUser = localStorage.getItem("username");
  const { userImg, setUserImg, setProfileImgModalOn } = props;
  const [fileImg, setFileImg] = useState(null); // 파일 업로드 할 이미지

  // 이미지 변경 제어
  const onChangeImg = (e) => {
    if (e.target.files[0]) {
      setFileImg(e.target.files[0]);
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
    }
    console.log(fileImg);
    sendProfileImgData(e);
    setProfileImgModalOn(false);
    location.reload();
  };

  const sendProfileImgData = (e) => {
    fncObj.executeQuery({
      url: "saveProfileImg",
      data: {
        username: localUser,
        file: e.target.files[0],
      },
      success: (res) => {},
    });
  };
  return (
    <div className="profile-delete-window">
      <div className="profile-delete-area">
        <div className="profile-delte__top">
          <h1>프로필 사진 변경</h1>
        </div>
        <div className="profile-delete__bottom">
          <input
            type="file"
            id="getProfileImgfile"
            accept="image/*, video/*"
            onChange={onChangeImg}
          />
          <div className="profile-delete-btn">
            <label htmlFor="getProfileImgfile">사진 업로드</label>
          </div>
          <div className="profile-delete-btn">
            <button>현재 사진 삭제</button>
          </div>
          <div className="profile-cancle-btn">
            <button>취소</button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ProfileImgModal;
