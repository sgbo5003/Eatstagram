import React, { useEffect, useState } from "react";
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
import tailImg from "../../public/images/tail.png";
import Modal from "../Modal";
import WriteModal from "./WriteModal";
const Header = () => {
  //   const headerItems = [
  //     {
  //       url: "/",
  //       iconIsClick: <AiFillHome />,
  //       iconNoClick: <AiOutlineHome />,
  //     },
  //     {
  //       url: "/Chat",
  //       iconIsClick: <FaPaperPlane />,
  //       iconNoClick: <FaRegPaperPlane />,
  //     },
  //     {
  //       url: "/WriteModal",
  //       iconIsClick: <FaPlusSquare />,
  //       iconNoClick: <FaRegPlusSquare />,
  //     },
  //     {
  //       url: "/Recommend",
  //       iconIsClick: <FaCompass />,
  //       iconNoClick: <FaRegCompass />,
  //     },
  //     {
  //       url: "/Notification",
  //       iconIsClick: <FaHeart />,
  //       iconNoClick: <FaRegHeart />,
  //     },
  //   ];
  const history = useHistory();
  const [writeModalOn, setWriteModalOn] = useState(false);
  const [checkedHeader, setCheckedHeader] = useState(new Set()); // 헤더 -> 클릭 된 것들 담는 state
  const [dropDown, setDropDown] = useState(false);

  // 글쓰기 모달창 제어
  const onWriteClick = () => {
    setWriteModalOn(true);
  };

  const onLogoClick = () => {
    history.push("/");
    location.reload();
  };

  const onProfileClick = () => {
    setDropDown(!dropDown);
  };

  //   const onCheckHeaderHandler = () => {
  //     let itemSet = new Set(checkedHeader);
  //     if (location.pathname === "/") {
  //       itemSet.clear();
  //       itemSet.add("/");
  //       setCheckedHeader(itemSet);
  //     } else if (
  //       location.pathname === "/Chat" ||
  //       location.pathname === "/ChatRoom"
  //     ) {
  //       itemSet.clear();
  //       itemSet.add("/Chat");
  //       setCheckedHeader(itemSet);
  //     } else if (location.pathname === "/WriteModal") {
  //       itemSet.clear();
  //       itemSet.add("/WriteModal");
  //       setCheckedHeader(itemSet);
  //     } else if (location.pathname === "/Recommend") {
  //       itemSet.clear();
  //       itemSet.add("/Recommend");
  //       setCheckedHeader(itemSet);
  //     } else if (location.pathname === "/Notification") {
  //       itemSet.clear();
  //       itemSet.add("/Notification");
  //       setCheckedHeader(itemSet);
  //     } else {
  //       itemSet.clear();
  //       setCheckedHeader(itemSet);
  //     }
  //   };

  //   useEffect(() => {
  //     onCheckHeaderHandler();
  //   }, [location.pathname]);

  return (
    <>
      <div className="header">
        <div className="header-area">
          <div>
            <h1 onClick={onLogoClick}>Eatstagram</h1>
          </div>

          <div className="header-area__icons">
            {/* {headerItems.map((data, idx) => {
              return (
                <Link to={data.url} key={idx}>
                  <p onClick={onCheckHeaderHandler}>
                    {checkedHeader.has(data.url)
                      ? data.iconIsClick
                      : data.iconNoClick}
                  </p>
                </Link>
              );
            })} */}
            <Link to="/">
              <p className="header-area__icons_items">
                <AiFillHome />
              </p>
            </Link>
            <Link to="/Chat">
              <p className="header-area__icons_items">
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
                onClick={onProfileClick}
              />
              {dropDown ? (
                <div className="user-dropdown">
                  <div className="user-dropdown-tail">
                    <img src={tailImg} alt="" />
                  </div>
                  <div className="user-dropdown-window">
                    <div className="user-dropdown-li">
                      <p>
                        <i className="far fa-user-circle"></i>
                      </p>
                      <p>프로필</p>
                    </div>
                    <div className="user-dropdown-li">
                      <p>
                        <i className="far fa-bookmark"></i>
                      </p>
                      <p>저장됨</p>
                    </div>
                    <div className="user-dropdown-li">
                      <p>
                        <i className="fas fa-cog"></i>
                      </p>
                      <p>설정</p>
                    </div>
                    <div className="user-dropdown-logout">
                      <p>로그아웃</p>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      {/*프로필 클릭 시 드롭다운*/}

      <Modal isOpen={writeModalOn} setIsOpen={setWriteModalOn}>
        <WriteModal />
      </Modal>
    </>
  );
};

export default Header;
