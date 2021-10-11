import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProfileEditSidebar = () => {
  const sideList = [
    {
      title: "프로필 편집",
      link: "/ProfileEdit",
    },
    {
      title: "비밀번호 변경",
      link: "/ProfileChangePassword",
    },
    {
      title: "탈퇴하기",
      link: "/ProfileSecession",
    },
  ];
  const [checkedItems, setCheckedItems] = useState(new Set());

  // 사이드바 클릭했는지 체크
  const onCheckedTopItemsHandler = () => {
    let itemSet = new Set(checkedItems);
    if (location.pathname === "/ProfileEdit") {
      itemSet.add("/ProfileEdit");
      setCheckedItems(itemSet);
    } else if (location.pathname === "/ProfileChangePassword") {
      itemSet.clear();
      itemSet.add("/ProfileChangePassword");
      setCheckedItems(itemSet);
    } else if (location.pathname === "/ProfileSecession") {
      itemSet.clear();
      itemSet.add("/ProfileSecession");
      setCheckedItems(itemSet);
    }
  };

  useEffect(() => {
    onCheckedTopItemsHandler();
  }, []);
  return (
    <div className="edit-left">
      {sideList.map((data, idx) => {
        return (
          <div
            className={`edit-list ${
              checkedItems.has(data.link) ? "checked" : ""
            }`}
            key={idx}
          >
            <Link to={data.link}>
              <p>{data.title}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileEditSidebar;
