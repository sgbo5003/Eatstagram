import React from "react";
import {
  FaHome,
  FaPaperPlane,
  FaRegPaperPlane,
  FaCompass,
  FaRegCompass,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import myProfileImg from "../images/묭수.jpg";

const Header = () => {
  return (
    <div className="header">
      <div className="header-area">
        <div>
          <h1>Eatstagram</h1>
        </div>

        <div className="header-area__icons">
          <p>
            <FaHome />
          </p>
          <p>
            <FaRegPaperPlane />
          </p>
          <p>
            <FaRegCompass />
          </p>
          <p>
            <FaRegHeart />
          </p>
          <div className="user-img__header">
            <img src={myProfileImg} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
