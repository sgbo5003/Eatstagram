import React, { useEffect } from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import * as fncObj from "../commonFunc/CommonObjFunctions";
const Recommend = () => {
  const categoryData = [
    {
      src: "./images/한식.png",
      title: "한식",
    },
    {
      src: "./images/양식.png",
      title: "양식",
    },
    {
      src: "./images/일식.png",
      title: "일식",
    },
    {
      src: "./images/중식.png",
      title: "중식",
    },
    {
      src: "./images/치피햄.png",
      title: "치피햄",
    },
    {
      src: "./images/분식.png",
      title: "분식",
    },
    {
      src: "./images/야식.png",
      title: "야식",
    },
    {
      src: "./images/디저트.png",
      title: "디저트",
    },
    {
      src: "./images/아시안.png",
      title: "아시안",
    },
  ];
  const localUser = localStorage.getItem("username");

  const getCategoryData = () => {
    fncObj.executeQuery({
      url: "content/getCategoryPagingList",
      data: {
        page: 0,
        size: 9,
        username: localUser,
        category: "한식",
      },
      success: (res) => {},
    });
  };

  useEffect(() => {
    getCategoryData();
  }, []);
  return (
    <div className="recommend-main-area">
      {/*카테고리 선택*/}
      <div className="category-area">
        <div className="category">
          {categoryData.map((data, idx) => {
            return (
              <button key={idx}>
                <img src={data.src} />
                {data.title}
              </button>
            );
          })}
        </div>
      </div>
      {/*게시글*/}
      <div className="category-post-area">
        <div className="category-post">
          <div className="category-post-li">
            <img src="./images/food.jpg" alt="" className="imghover" />
            {/* <div className="post-hover">
              <h4>
                <i className="fas fa-heart"></i>55
              </h4>
              <h4>
                <i className="fas fa-comment"></i>10
              </h4>
            </div> */}
          </div>

          <div className="category-post-li">
            <img src="./images/food.jpg" alt="" />
          </div>

          <div className="category-post-li">
            <img src="./images/food.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommend;
