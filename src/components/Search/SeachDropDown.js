import React from "react";

const SearchDropDown = () => {
  return (
    <>
      <div className="search-dropdown-tail">
        <img src="./images/tail.png" alt="" />
      </div>
      <div className="search-dropdown-window">
        <div className="search-dropdown-history">
          <h2>최근 검색항목</h2>
          <button>모두 지우기</button>
        </div>
        <div className="search-dropdown-li">
          <img src="./images/food.jpg" alt="" />
          <div className="search-dropdown-li__content">
            <div className="search-dropdown-li__user">
              <h2>yeonhadong</h2>
              <h4>• 연하동 / 연남동 맛집</h4>
            </div>
            <button>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchDropDown;
