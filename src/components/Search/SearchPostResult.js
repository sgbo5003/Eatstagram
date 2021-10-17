import React, { useEffect, useState } from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import { AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import Modal from "../../Modal";
import CommentModal from "../Home/CommentModal";

let page = 0;

const SearchPostResult = (props) => {
  const { localUser, paramsId, contentFilePath, profileFilePath } = props;
  const [postList, setPostList] = useState([]);
  const [hover, setHover] = useState({}); // 마우스 hover
  const [commentModalOn, setCommentModalOn] = useState(false);
  const [commentData, setCommentData] = useState({});
  const [items, setItems] = useState([]);

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

  const getPostSearchResultData = () => {
    fncObj.executeQuery({
      url: "content/getSearchPagingList",
      data: {
        page: 0,
        size: 9,
        username: localUser,
        condition: paramsId,
      },
      success: (res) => {
        res.content.map((item, idx) => {
          getRegdate(item);
        });
        setPostList(res.content);
      },
    });
  };

  const getAddPostSearchResultData = (page) => {
    fncObj.executeQuery({
      url: "content/getSearchPagingList",
      data: {
        page: page,
        size: 6,
        username: localUser,
        condition: paramsId,
      },
      success: (res) => {
        if (res.content.length > 0) {
          res.content.map((item, idx) => {
            getRegdate(item);
          });
          setPostList(postList.concat(res.content));
        } else {
          return;
        }
      },
    });
  };

  // 게시글 마우스 Over시
  const onMouseOverHandler = (data, idx) => {
    if (data.contentId === postList[idx].contentId) {
      setHover({ contentId: data.contentId });
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

  useEffect(() => {
    getPostSearchResultData();
    page = 0;
  }, [paramsId]);

  // 스크롤 감지
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      ++page;
      getAddPostSearchResultData(page);
    }
  };

  // 스크롤 이벤트
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div className="search-result">
      <div className="search-post">
        {postList.map((data, idx) => {
          if (
            data.contentFileDTOList[0].type === "image/jpeg" ||
            data.contentFileDTOList[0].type === "image/png"
          ) {
            return (
              <div
                className="search-post-li"
                onMouseEnter={() => onMouseOverHandler(data, idx)}
                onMouseLeave={onMouseOutHandler}
                onClick={() => onCommentModalHandler(data)}
                key={idx}
              >
                <img
                  src={contentFilePath + data.contentFileDTOList[0].name}
                  alt={`게시글${idx}`}
                  className="imghover"
                />
                {hover.contentId === data.contentId ? (
                  <div className="search-post-hover">
                    <h4>
                      <FaHeart className="search-post-hover-icon" />
                      {data.likeCount}
                    </h4>
                    <h4>
                      <FaComment className="search-post-hover-icon" />
                      {data.replyCount}
                    </h4>
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          } else if (data.contentFileDTOList[0].type === "video/mp4") {
            return (
              <div
                className="search-post-li"
                onMouseEnter={() => onMouseOverHandler(data, idx)}
                onMouseLeave={onMouseOutHandler}
                onClick={() => onCommentModalHandler(data)}
                key={idx}
              >
                <video controls>
                  <source
                    src={contentFilePath + data.contentFileDTOList[0].name}
                    type="video/mp4"
                  />
                </video>
                {hover.contentId === data.contentId ? (
                  <div className="search-post-hover">
                    <h4>
                      <FaHeart className="search-post-hover-icon" />
                      {data.likeCount}
                    </h4>
                    <h4>
                      <FaComment className="search-post-hover-icon" />
                      {data.replyCount}
                    </h4>
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          }
        })}
      </div>
      <Modal isOpen={commentModalOn} setIsOpen={setCommentModalOn}>
        <CommentModal
          commentData={commentData}
          setCommentModalOn={setCommentModalOn}
          items={items}
          setItems={setItems}
          getRegdate={getRegdate}
          settings={settings}
          contentFilePath={contentFilePath}
          profileFilePath={profileFilePath}
        />
      </Modal>
    </div>
  );
};

export default SearchPostResult;
