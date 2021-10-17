import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router";
import profileDefaultImg from "../../../public/images/default_user.png";
const SearchDropDown = (props) => {
  const {
    wrapperRef,
    setModalOn,
    userList,
    setUserList,
    setInputText,
    profileFilePath,
  } = props;
  const history = useHistory();

  const handleClickOutSide = (e) => {
    if (wrapperRef && !wrapperRef.current.contains(e.target)) {
      setModalOn(false);
      setUserList([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  });

  const userListClickHandler = (data) => {
    history.push(`/SearchResult?result=${data}`);
    setInputText("");
    setModalOn(false);
  };

  return (
    <>
      <div className="search-dropdown-tail">
        <img src="./images/tail.png" alt="" />
      </div>
      <div className="search-dropdown-window">
        <div className="search-dropdown-history">
          <h2>검색항목</h2>
        </div>
        {userList.map((data, idx) => {
          return (
            <div
              className="search-dropdown-li"
              key={idx}
              onClick={() => userListClickHandler(data.nickname)}
            >
              <img
                src={
                  data.profileImgName === null
                    ? profileDefaultImg
                    : profileFilePath + data.profileImgName
                }
                alt=""
              />
              <div className="search-dropdown-li__content">
                <div className="search-dropdown-li__user">
                  <h2>{data.nickname}</h2>
                  <h4>{data.name}</h4>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SearchDropDown;
