import React, { useEffect, useState } from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import * as fncObj from "../commonFunc/CommonObjFunctions";
import Modal from "../Modal";
import CommentModal from "./Home/CommentModal";
import { AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
const Recommend = (props) => {
  const { contentFilePath } = props;
  const categoryData = [
    {
      src: "/public/images/한식.png",
      title: "한식",
    },
    {
      src: "/public/images/양식.png",
      title: "양식",
    },
    {
      src: "/public/images/일식.png",
      title: "일식",
    },
    {
      src: "/public/images/중식.png",
      title: "중식",
    },
    {
      src: "/public/images/치피햄.png",
      title: "치킨·피자·햄버거",
    },
    {
      src: "/public/images/분식.png",
      title: "분식",
    },
    {
      src: "/public/images/야식.png",
      title: "야식",
    },
    {
      src: "/public/images/디저트.png",
      title: "디저트",
    },
    {
      src: "/public/images/아시안.png",
      title: "아시안",
    },
  ];
  const localUser = localStorage.getItem("username");
  const [posts, setPosts] = useState([]);
  const [menuClicked, setMenuClicked] = useState(new Set());
  const [hover, setHover] = useState({}); // 마우스 hover
  const [commentModalOn, setCommentModalOn] = useState(false);
  const [commentData, setCommentData] = useState({});
  const [items, setItems] = useState([]);

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
        res.content.map((item, idx) => {
          getRegdate(item);
        });
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
        res.content.map((item, idx) => {
          getRegdate(item);
        });
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

  // 게시물 클릭 시 댓글창 오픈
  const onCommentModalHandler = (data) => {
    setCommentData(data);
    setCommentModalOn(true);
  };

  const getRegdate = (item) => {
    const now = new Date();
    //글쓴 시간
    const writeDay = new Date(item.regDate);
    //또는 파라미터로 시간을 넘겨받아서 계산할 수도 있음..
    let minus;
    //현재 년도랑 글쓴시간의 년도 비교
    if (now.getFullYear() > writeDay.getFullYear()) {
      minus = now.getFullYear() - writeDay.getFullYear();
      //두개의 차이를 구해서 표시
      item.time = minus + "년 전";
    } else if (now.getMonth() > writeDay.getMonth()) {
      //년도가 같을 경우 달을 비교해서 출력
      minus = now.getMonth() - writeDay.getMonth();
      item.time = minus + "달 전";
    } else if (now.getDate() > writeDay.getDate()) {
      //같은 달일 경우 일을 계산
      minus = now.getDate() - writeDay.getDate();
      item.time = minus + "일 전";
    } else if (now.getDate() === writeDay.getDate()) {
      //당일인 경우에는
      const nowTime = now.getTime();
      const writeTime = writeDay.getTime();
      if (nowTime > writeTime) {
        //시간을 비교
        let sec = parseInt(nowTime - writeTime) / 1000;
        const day = parseInt(sec / 60 / 60 / 24);
        sec = sec - day * 60 * 60 * 24;
        const hour = parseInt(sec / 60 / 60);
        sec = sec - hour * 60 * 60;
        const min = parseInt(sec / 60);
        sec = parseInt(sec - min * 60);
        if (hour > 0) {
          //몇시간전인지
          item.time = hour + "시간 전";
        } else if (min > 0) {
          //몇분전인지
          item.time = min + "분 전";
        } else if (sec > 0) {
          //몇초전인지 계산
          item.time = sec + "초 전";
        } else {
          item.time = "방금전";
        }
      } else {
        item.time = "방금전";
      }
    }
  };

  // Slider 세팅
  const settings = {
    dots: true, // 캐러셀의 점을 보여줄 것인지
    infinite: true, // 마지막 장 다음에 첫번째가 나오게 할 것인지
    speed: 500, // 넘어가는 속도는 몇으로 할 것인지
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <AiFillRightCircle color="#ffffff" />,
    prevArrow: <AiFillLeftCircle color="#ffffff" />,
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
                onClick={() => onCommentModalHandler(data)}
              >
                <img
                  src={contentFilePath + data.contentFileDTOList[0].name}
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
          <Modal isOpen={commentModalOn} setIsOpen={setCommentModalOn}>
            <CommentModal
              commentData={commentData}
              setCommentModalOn={setCommentModalOn}
              items={items}
              setItems={setItems}
              getRegdate={getRegdate}
              settings={settings}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Recommend;
