import React, { useEffect, useState } from "react";
import { FaTh, FaUser, FaSearch } from "react-icons/fa";
import SearchPostResult from "./SearchPostResult";
import SearchUserResult from "./SearchUserResult";

const SearchResult = (props) => {
  const { contentFilePath, profileFilePath } = props;
  const [menuClicked, setMenuClicked] = useState(false);
  const paramsIdStr = location.search.split("=")[1];
  const paramsId = decodeURI(paramsIdStr);
  const localUser = localStorage.getItem("username");

  const onPostMenuClick = () => {
    setMenuClicked(true);
  };

  const onSaveMenuClick = () => {
    setMenuClicked(false);
  };

  return (
    <div className="search-result-main-area">
      <div className="search-area">
        <div className="search-word">
          <h1>
            <FaSearch className="search-word-icon" /> {paramsId}
          </h1>
        </div>

        <div className="search-area-border">
          <div className="search-area-border-li" onClick={onSaveMenuClick}>
            {menuClicked ? "" : <span className="search-bar-user"></span>}
            <p>
              <FaUser />
            </p>
            <p>사용자</p>
          </div>
          <div className="search-area-border-li" onClick={onPostMenuClick}>
            {menuClicked ? <span className="search-bar-user"></span> : ""}
            <span className="search-bar-post"></span>
            <p>
              <FaTh />
            </p>
            <p>게시물</p>
          </div>
        </div>
        {menuClicked ? (
          <SearchPostResult
            localUser={localUser}
            paramsId={paramsId}
            contentFilePath={contentFilePath}
            profileFilePath={profileFilePath}
          />
        ) : (
          <SearchUserResult
            localUser={localUser}
            paramsId={paramsId}
            profileFilePath={profileFilePath}
          />
        )}
      </div>
    </div>
  );
};

export default SearchResult;
