import React, { useEffect, useState } from "react";
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
      title: "치킨·피자·햄버거",
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
  const [posts, setPosts] = useState([]);
  const [menuClicked, setMenuClicked] = useState(new Set());
  const [hover, setHover] = useState({}); // 마우스 hover

  const getCategoryData = () => {
    fncObj.executeQuery({
      url: "content/getCategoryPagingList",
      data: {
        page: 0,
        size: 9,
        username: localUser,
        category: "한식",
      },
      success: (res) => {
        setPosts(res.content);
      },
    });
  };

  const onClickCategoryData = (data) => {
    let itemSet = new Set(menuClicked);
    itemSet.add(data);
    setMenuClicked(itemSet);
    if (itemSet.size > 1) {
      itemSet.clear();
      itemSet.add(data);
      setMenuClicked(itemSet);
    }
    fncObj.executeQuery({
      url: "content/getCategoryPagingList",
      data: {
        page: 0,
        size: 6,
        username: localUser,
        category: data,
      },
      success: (res) => {
        setPosts(res.content);
      },
    });
  };

  // 게시글 마우스 Over시
  const onMouseOverHandler = (data, idx) => {
    if (data.location === posts[idx].location) {
      setHover({ location: data.location });
    }
  };
  // 게시글 마우스 Out시
  const onMouseOutHandler = () => {
    setHover({});
  };

  useEffect(() => {
    getCategoryData();
    let itemSet = new Set(menuClicked);
    itemSet.add("한식");
    setMenuClicked(itemSet);
  }, []);
  return (
    <div className="recommend-main-area">
      {/*카테고리 선택*/}
      <div className="category-area">
        <div className="category">
          {categoryData.map((data, idx) => {
            return (
              <button
                key={idx}
                onClick={() => onClickCategoryData(data.title)}
                className={menuClicked.has(data.title) ? "button-hover" : ""}
              >
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
          {posts.map((data, idx) => {
            return (
              <div
                className="category-post-li"
                key={idx}
                onMouseEnter={() => onMouseOverHandler(data, idx)}
                onMouseLeave={onMouseOutHandler}
              >
                <img
                  src={`upload/content/${data.contentFileDTOList[0].name}`}
                  alt="추천 게시글"
                  className="imghover"
                />
                {hover.location === data.location ? (
                  <div className="post-hover">
                    <h4>
                      <FaHeart className="post-hover-icon" />
                      {data.likeCount}
                    </h4>
                    <h4>
                      <FaComment className="post-hover-icon" />
                      {data.replyCount}
                    </h4>
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Recommend;
