import React from "react";
import ProfileEditSidebar from "./ProfileEditSidebar";

const ProfileEdit = () => {
  const localUser = localStorage.getItem("username");
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
              <h1>{localUser}</h1>
              <button>프로필 사진 바꾸기</button>
            </div>
          </div>
          <div className="edit-right-li">
            <aside>
              <label htmlFor="username">이름</label>
            </aside>
            <div className="edit-right-li__input">
              <input type="text" placeholder="이름" />
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
              <input type="text" placeholder="아이디를 입력해주세요" />
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
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
