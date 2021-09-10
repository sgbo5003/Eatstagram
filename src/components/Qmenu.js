import React, { useState } from "react";
import { Link } from "react-router-dom";
import tailImg from "../images/tail.png";

const Qmenu = (props) => {
  const qmenuList = [
    {
      link: "/AccountManagement",
      text: "계정관리",
    },
    {
      link: "/ChangePassword",
      text: "비밀번호 변경",
    },
    {
      link: "/Inquiry",
      text: "문의하기",
    },
    {
      link: "/Notice?page=1",
      text: "공지사항",
    },
  ];
  return (
    <div className="Qmenu_bar_on">
      <span className="tail_on">
        <img className="tail_img" src={tailImg} alt="tail.png" />
      </span>
      {qmenuList.map((data, index) => {
        return (
          <p className="Qmenu_menu_cove" key={index}>
            <li className="Qmenu_menu">{data.text}</li>
          </p>
        );
      })}
    </div>
  );
};

export default Qmenu;
