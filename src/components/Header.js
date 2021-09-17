import React, { useState } from "react";
import {
  FaHome,
  FaPaperPlane,
  FaRegPaperPlane,
  FaCompass,
  FaRegCompass,
  FaHeart,
  FaRegHeart,
  FaPlusSquare,
  FaRegPlusSquare,
} from "react-icons/fa"; // Reg 붙은게 색깔 없는거
import { useHistory } from "react-router";
import myProfileImg from "../images/묭수.jpg";
import Modal from "../Modal";
import WriteModal from "./WriteModal";
const Header = () => {
  const history = useHistory();
  const [writeModalOn, setWriteModalOn] = useState(false);

  // 글쓰기 모달창 제어
  const onWriteClick = () => {
    setWriteModalOn(true);
  };

  // 채팅 화면 이동
  const onChatClick = () => {
    history.push("/Chat");
  };
  return (
    <>
      <div className="header">
        <div className="header-area">
          <div>
            <h1>Eatstagram</h1>
          </div>

          <div className="header-area__icons">
            <p>
              <FaHome />
            </p>
            <p onClick={onChatClick}>
              <FaRegPaperPlane />
            </p>
            <p onClick={onWriteClick}>
              <FaRegPlusSquare />
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
      <Modal isOpen={writeModalOn} setIsOpen={setWriteModalOn}>
        <WriteModal />
      </Modal>
    </>
  );
};

export default Header;
