import React, { useEffect, useState } from "react";
import foodImg from "../../../public/images/food.jpg";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import { FaHeart, FaComment, FaCamera } from "react-icons/fa";
import { AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
import Modal from "../../Modal";
import CommentModal from "../Home/CommentModal";

let page = 0;

const ProfileSave = (props) => {
  const {
    posts,
    setPosts,
    hover,
    setHover,
    onMouseOverHandler,
    onMouseOutHandler,
    paramsId,
  } = props;
  const localUser = localStorage.getItem("username");
  const [commentModalOn, setCommentModalOn] = useState(false);
  const [commentData, setCommentData] = useState({});
  const [items, setItems] = useState([]);
  // 게시물 저장 data 불러오기
  const getData = () => {
    fncObj.executeQuery({
      url: "content/getSavedPagingList",
      data: {
        page: 0,
        size: 6,
        username: paramsId,
      },
      success: (res) => {
        res.content.map((item, idx) => {
          getRegdate(item);
        });
        setPosts(res.content);
      },
    });
  };

  // 게시물 저장 data 추가로 불러오기
  const getAddData = (page) => {
    fncObj.executeQuery({
      url: "content/getSavedPagingList",
      data: {
        page: page,
        size: 6,
        username: paramsId,
      },
      success: (res) => {
        if (res.content.length > 0) setPosts(posts.concat(res.content));
      },
    });
  };

  // 게시물 클릭 시 댓글창 오픈
  const onCommentModalHandler = (data) => {
    setCommentData(data);
    setCommentModalOn(true);
  };
  useEffect(() => {
    getData();
  }, []);

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

  // 스크롤 감지
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      ++page;
      getAddData(page);
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
    <>
      <div className="profile-area__post">
        {posts.length > 0 ? (
          posts.map((data, idx) => {
            if (
              data.contentFileDTOList[0].type === "image/jpeg" ||
              data.contentFileDTOList[0].type === "image/png"
            ) {
              return (
                <div
                  className="profile-area__post-li"
                  onMouseEnter={() => onMouseOverHandler(data, idx)}
                  onMouseLeave={onMouseOutHandler}
                  onClick={() => onCommentModalHandler(data)}
                  key={idx}
                >
                  <img
                    src={`upload/content/${data.contentFileDTOList[0].name}`}
                    alt={`게시글${idx}`}
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
            } else if (data.contentFileDTOList[0].type === "video/mp4") {
              return (
                <div
                  className="profile-area__post-li"
                  key={idx}
                  onMouseEnter={() => onMouseOverHandler(data, idx)}
                  onMouseLeave={onMouseOutHandler}
                  onClick={() => onCommentModalHandler(data)}
                >
                  <video controls>
                    <source
                      src={`upload/content/${data.contentFileDTOList[0].name}`}
                      type="video/mp4"
                    />
                  </video>
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
            }
          })
        ) : (
          <div className="profile-empty">
            <h1>
              <FaCamera />
            </h1>
            <h1>게시물 없음</h1>
          </div>
        )}
      </div>
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
    </>
  );
};

export default ProfileSave;
