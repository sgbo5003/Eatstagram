import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import SearchDropDown from "./SeachDropDown";

const Search = () => {
  const [modalOn, setModalOn] = useState(false);
  return (
    <div className="header-search">
      <input type="text" placeholder="검색" />
      <p>
        <FaSearch />
      </p>
      <div className="search-dropdown">{modalOn ? <SearchDropDown /> : ""}</div>
    </div>
  );
};

export default Search;
