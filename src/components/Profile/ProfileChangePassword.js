import React from "react";
import ProfileEditSidebar from "./ProfileEditSidebar";

const ProfileChangePassword = () => {
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
              <h1>gyurrr</h1>
            </div>
          </div>
          <div className="edit-right-li">
            <aside>
              <label htmlFor="password">이전 비밀번호</label>
            </aside>
            <div className="edit-right-li__input">
              <input type="text" />
            </div>
          </div>
          <div className="edit-right-li">
            <aside>
              <label htmlFor="userid">새 비밀번호</label>
            </aside>
            <div className="edit-right-li__input">
              <input type="text" />
            </div>
          </div>
          <div className="edit-right-li">
            <aside>
              <label htmlFor="usertext">새 비밀번호 확인</label>
            </aside>
            <div className="edit-right-li__input">
              <input type="text" />
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
