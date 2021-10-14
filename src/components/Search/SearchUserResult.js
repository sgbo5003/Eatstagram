import React, { useEffect } from "react";

const SearchUserResult = (props) => {
  const { resultList, setResultList, getUserSearchResultData } = props;

  useEffect(() => {
    getUserSearchResultData();
  }, []);
  return (
    <div className="search-result">
      {[1, 2, 3, 4].map((data, idx) => {
        return (
          <div className="search-result__list" key={idx}>
            <div className="search-result-user">
              <img src="./images/food.jpg" alt="" />
              <div className="search-result__info">
                <h1>연하동</h1>
                <h4>일식</h4>
              </div>
            </div>
            <button>구독</button>
          </div>
        );
      })}
    </div>
  );
};

export default SearchUserResult;
