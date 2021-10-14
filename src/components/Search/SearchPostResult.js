import React, { useEffect, useState } from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import * as fncObj from "../../commonFunc/CommonObjFunctions";

const SearchPostResult = (props) => {
  const { localUser, paramsId } = props;
  const [postList, setPostList] = useState([]);

  const getPostSearchResultData = () => {
    fncObj.executeQuery({
      url: "content/getSearchPagingList",
      data: {
        page: 0,
        size: 6,
        username: localUser,
        condition: paramsId,
      },
      success: (res) => {
        setPostList(res.content);
      },
    });
  };

  useEffect(() => {
    getPostSearchResultData();
    console.log(localUser, paramsId);
  }, []);

  return (
    <div className="search-result">
      <div className="search-post">
        <div className="search-post-li">
          <img src="./images/food.jpg" alt="" className="imghover" />
          <div className="search-post-hover">
            <h4>
              <FaHeart className="search-post-hover-icon" />
              55
            </h4>
            <h4>
              <FaComment className="search-post-hover-icon" />
              10
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPostResult;
