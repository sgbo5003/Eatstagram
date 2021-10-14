import React, { useEffect, useState } from "react";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
const SearchUserResult = (props) => {
  const { localUser, paramsId } = props;
  const [userList, setUserList] = useState([]);

  const getUserSearchResultData = () => {
    fncObj.executeQuery({
      url: "getSearchPagingList",
      data: {
        page: 0,
        size: 6,
        username: localUser,
        condition: paramsId,
      },
      success: (res) => {
        setUserList(res.content);
      },
    });
  };

  useEffect(() => {
    getUserSearchResultData();
  }, [paramsId]);
  return (
    <div className="search-result">
      {userList.map((data, idx) => {
        return (
          <div className="search-result__list" key={idx}>
            <div className="search-result-user">
              <img src="./images/food.jpg" alt="" />
              <div className="search-result__info">
                <h1>{data.nickname}</h1>
                <h4>{data.name}</h4>
              </div>
            </div>
            {data.subscriptionYn === "Y" ? (
              <button>구독중</button>
            ) : (
              <button>구독</button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SearchUserResult;
