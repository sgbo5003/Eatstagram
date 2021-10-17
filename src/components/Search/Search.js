import React, { useEffect, useRef, useState } from "react";
import SearchDropDown from "./SeachDropDown";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import { useHistory } from "react-router";

const Search = () => {
  const history = useHistory();
  const [modalOn, setModalOn] = useState(false);
  const localUser = localStorage.getItem("username");
  const wrapperRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [userList, setUserList] = useState([]);
  const onDropDownHandler = () => {
    setModalOn(true);
  };

  // input 입력값
  const onInputTextHandler = (e) => {
    setInputText(e.target.value);
    if (e.target.value === "" || e.target.value.trim() === "") {
      return;
    } else {
      getUserSearchData(e);
    }
  };

  // enter 입력 (Enter키)
  const onKeyPress = (e) => {
    if (e.key == "Enter") {
      if (e.target.value === "" || e.target.value.trim() === "") {
        return;
      } else {
        history.push(`/SearchResult?result=${e.target.value}`);
        setInputText("");
        setModalOn(false);
      }
    }
  };

  // 검색 입력값 조회 (유저기반)
  const getUserSearchData = (e) => {
    fncObj.executeQuery({
      url: "getSearchList",
      data: {
        condition: e.target.value,
        username: localUser,
      },
      success: (res) => {
        setUserList(res);
      },
    });
  };

  return (
    <div className="header-search">
      <input
        type="text"
        placeholder="검색"
        onClick={onDropDownHandler}
        value={inputText}
        onChange={onInputTextHandler}
        onKeyPress={onKeyPress}
      />
      <div className="search-dropdown" ref={wrapperRef}>
        {modalOn ? (
          <SearchDropDown
            wrapperRef={wrapperRef}
            setModalOn={setModalOn}
            userList={userList}
            setUserList={setUserList}
            inputText={inputText}
            setInputText={setInputText}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Search;
