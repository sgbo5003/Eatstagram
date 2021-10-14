import React, { useEffect } from "react";
import { FaHeart, FaComment } from "react-icons/fa";

const SearchPostResult = () => {
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
