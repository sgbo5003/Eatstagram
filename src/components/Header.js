import React, { useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaRegPaperPlane,
  FaCompass,
  FaRegCompass,
  FaHeart,
  FaRegHeart,
  FaPlusSquare,
  FaRegPlusSquare,
} from "react-icons/fa"; // Reg 붙은게 색깔 없는거
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import myProfileImg from "../../public/images/묭수.jpg";

import Modal from "../Modal";
import WriteModal from "./Write/WriteModal";
import ProfileDropDown from "./Profile/ProfileDropDown";
const Header = () => {
  const localUserName = localStorage.getItem("username");
  const webSocketUrl = `ws://localhost:8080/eatstagram/ws/header/${localUserName}`;
  let ws = useRef(null);
  const history = useHistory();
  const [writeModalOn, setWriteModalOn] = useState(false);
  const [checkedHeader, setCheckedHeader] = useState(new Set()); // 헤더 -> 클릭 된 것들 담는 state
  const [dropDown, setDropDown] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  // 글쓰기 모달창 제어
  const onWriteClick = () => {
    setWriteModalOn(true);
  };

  const onLogoClick = () => {
    history.push("/");
    location.reload();
  };

  const onDropDownHandler = () => {
    setDropDown(!dropDown);
  };

  const onProfileClick = () => {
    history.push("/Profile");
    setDropDown(false);
  };

  useEffect(() => {
    ws.current = new WebSocket(webSocketUrl);
    if (location.pathname !== "/Chat") {
      ws.current.onopen = () => {
        console.log("connected to " + webSocketUrl);
        // 안읽은 채팅이 있는지 조회 -> readYn : Y or N
      };
    }
    ws.current.onclose = (error) => {
      console.log("disconnect from " + webSocketUrl);
      console.log(error);
      // 안읽은 채팅이 있는지 조회 -> readYn : Y or N
    };
    ws.current.onerror = (error) => {
      console.log("connection error " + webSocketUrl);
      console.log(error);
    };
    ws.current.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      console.log(data);
    };
    return () => {
      console.log("clean up");
      ws.current.close();
    };
  }, []);

  return (
    <>
      <div className="header">
        <div className="header-area">
          <div>
            <h1 onClick={onLogoClick}>Eatstagram</h1>
          </div>

          <div className="header-area__icons">
            <Link to="/">
              <p className="header-area__icons_items">
                <AiFillHome />
              </p>
            </Link>
            <Link to="/Chat">
              <p className="header-area__icons_items-message">
                {messageCount > 0 ? (
                  <span className="badge">{messageCount}</span>
                ) : (
                  ""
                )}
                <FaRegPaperPlane />
              </p>
            </Link>
            <p className="header-area__icons_items" onClick={onWriteClick}>
              <FaRegPlusSquare />
            </p>
            <Link to="/Recommend">
              <p className="header-area__icons_items">
                <FaRegCompass />
              </p>
            </Link>
            <Link to="/Notification">
              <p className="header-area__icons_items">
                <FaRegHeart />
              </p>
            </Link>
            <div className="user-img__header">
              <img
                className="user-img__header_profile_img"
                src={myProfileImg}
                alt=""
                onClick={onDropDownHandler}
              />
            </div>
            {dropDown ? (
              <ProfileDropDown onProfileClick={onProfileClick} />
            ) : (
              ""
            )}
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
