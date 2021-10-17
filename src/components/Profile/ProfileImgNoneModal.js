import React, { useState } from "react";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
const ProfileImgNoneModal = (props) => {
  const localUser = localStorage.getItem("username");
  const { userImg, setUserImg, setProfileImgModalOn } = props;
  const [fileImg, setFileImg] = useState(null); // 파일 업로드 할 이미지

  const onClickCancelBtn = () => {
    setProfileImgModalOn(false);
  };

  // 이미지 변경 제어
  const onChangeImg = (e) => {
    if (e.target.files[0]) {
      setFileImg(e.target.files[0]);
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
    }
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
    <div className="edit-img-none-window">
      <div className="edit-img-area">
        <div className="edit-img__top">
          <h1>프로필 사진 바꾸기</h1>
        </div>
        <div className="edit-img__bottom">
          <div className="edit-img-btn upload">
            <input
              type="file"
              id="getProfileImgfile"
              accept="image/*, video/*"
              onChange={onChangeImg}
            />
            <button>
              <label htmlFor="getProfileImgfile">사진업로드</label>
            </button>
          </div>
          <div className="edit-img-btn cancle">
            <button onClick={onClickCancelBtn}>취소</button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ProfileImgNoneModal;
