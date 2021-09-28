import React from "react";
import myProfileImg from "../../../public/images/묭수.jpg";

const ProfilePost = () => {
  return (
    <div className="profile-area__post">
      <img src={myProfileImg} alt="" />
      <img src={myProfileImg} alt="" />
      <img src={myProfileImg} alt="" />
    </div>
  );
};

export default ProfilePost;
