import React, { useState } from "react";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import Modal from "../../Modal";
import ProfileImgModal from "./ProfileImgModal";
import profileDefaultImg from "../../../public/images/default_user.png";
const ProfileEditPage = (props) => {
  const { profileData, localUser } = props;

  const [inputData, setInputData] = useState({
    name: "",
    nickname: "",
    introduce: "",
  });
  const [profileImgModalOn, setProfileImgModalOn] = useState(false); // 프로필 이미지 모달
  const [userImg, setUserImg] = useState(null); // 유저의 이미지
  const onProfileImgClick = () => {
    setProfileImgModalOn(true);
  };

  //input 값 감지 함수
  const onChangeInputHandler = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
    console.log(inputData);
  };

  const sendProfileEditData = () => {
    fncObj.executeQuery({
      url: "setMemberInfo",
      data: {
        username: localUser,
        name: inputData.name,
        nickname: inputData.nickname,
        introduce: inputData.introduce,
      },
      success: (res) => {
        const obj = { ...profileData };
        obj.name = res.name;
        obj.nickname = res.nickname;
        obj.introduce = res.introduce;
        setProfileData(obj);
        alert("프로필 수정 완료");
        localStorage.setItem("userNickname", res.nickname);
      },
    });
  };

  const onSubmit = () => {
    sendProfileEditData();
  };
  return (
    <>
      <div className="edit-right-li">
        <aside>
          <img
            src={
              profileData.profileImgName === null
                ? profileDefaultImg
                : `upload/profile/${profileData.profileImgName}`
            }
            alt=""
            onClick={onProfileImgClick}
          />
        </aside>
        <div className="edit-right-li__input">
          <h1>{profileData.nickname}</h1>
          <button onClick={onProfileImgClick}>프로필 사진 바꾸기</button>
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
          <label htmlFor="userid">닉네임</label>
        </aside>
        <div className="edit-right-li__input">
          <input
            type="text"
            name="nickname"
            placeholder="닉네임을 입력해주세요"
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
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            name="introduce"
            defaultValue={profileData.introduce}
            onChange={onChangeInputHandler}
          ></textarea>
        </div>
      </div>
      <div className="edit-right-li edit-btn">
        <aside></aside>
        <div className="edit-right-li__btn ">
          <button className="active" onClick={onSubmit}>
            변경하기
          </button>
        </div>
      </div>
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

export default ProfileEditPage;
