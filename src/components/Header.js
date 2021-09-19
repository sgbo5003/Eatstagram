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
import myProfileImg from "../images/묭수.jpg";
import Modal from "../Modal";
import WriteModal from "./WriteModal";
const Header = () => {
  const headerItems = [
    {
      url: "/",
      iconIsClick: <AiFillHome />,
      iconNoClick: <AiOutlineHome />,
    },
    {
      url: "/Chat",
      iconIsClick: <FaPaperPlane />,
      iconNoClick: <FaRegPaperPlane />,
    },
    {
      url: "/WriteModal",
      iconIsClick: <FaPlusSquare />,
      iconNoClick: <FaRegPlusSquare />,
    },
    {
      url: "/Recommend",
      iconIsClick: <FaCompass />,
      iconNoClick: <FaRegCompass />,
    },
    {
      url: "/Notification",
      iconIsClick: <FaHeart />,
      iconNoClick: <FaRegHeart />,
    },
  ];
  const history = useHistory();
  const [writeModalOn, setWriteModalOn] = useState(false);
  const [checkedHeader, setCheckedHeader] = useState(new Set()); // 헤더 -> 클릭 된 것들 담는 state

  // 글쓰기 모달창 제어
  const onWriteClick = () => {
    setWriteModalOn(true);
  };

  const onCheckHeaderHandler = () => {
    let itemSet = new Set(checkedHeader);
    if (location.pathname === "/") {
      itemSet.clear();
      itemSet.add("/");
      setCheckedHeader(itemSet);
    } else if (location.pathname === "/Chat") {
      itemSet.clear();
      itemSet.add("/Chat");
      setCheckedHeader(itemSet);
    } else if (location.pathname === "/WriteModal") {
      itemSet.clear();
      itemSet.add("/WriteModal");
      setCheckedHeader(itemSet);
    } else if (location.pathname === "/Recommend") {
      itemSet.clear();
      itemSet.add("/Recommend");
      setCheckedHeader(itemSet);
    } else if (location.pathname === "/Notification") {
      itemSet.clear();
      itemSet.add("/Notification");
      setCheckedHeader(itemSet);
    } else {
      itemSet.clear();
      setCheckedHeader(itemSet);
    }
  };

  useEffect(() => {
    onCheckHeaderHandler();
  }, [location.pathname]);

  return (
    <>
      <div className="header">
        <div className="header-area">
          <div>
            <h1>Eatstagram</h1>
          </div>

          <div className="header-area__icons">
            {headerItems.map((data, idx) => {
              return (
                <Link to={data.url} key={idx}>
                  <p onClick={onCheckHeaderHandler}>
                    {checkedHeader.has(data.url)
                      ? data.iconIsClick
                      : data.iconNoClick}
                  </p>
                </Link>
              );
            })}
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
