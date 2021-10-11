import React from "react";
import ProfileEditSidebar from "./ProfileEditSidebar";

const ProfileSecession = () => {
  return (
    <div className="main-area">
      <div className="edit-area">
        <ProfileEditSidebar />
        <div className="edit-right">
          <div className="edit-right-delete">
            <h4>계정을 탈퇴하시겠습니까?</h4>
            <div className="delte-btn">
              <button>네</button>
              <button>아니오</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSecession;
