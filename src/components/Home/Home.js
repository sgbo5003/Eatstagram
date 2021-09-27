import React, { useEffect, useRef, useState } from "react";
import myProfileImg from "../../../public/images/묭수.jpg";
import storyProfileImg1 from "../../../public/images/명수스토리.jpg";
import storyProfileImg2 from "../../../public/images/명수스토리2.jpg";
import storyProfileImg3 from "../../../public/images/명수스토리3.jpg";
import storyProfileImg4 from "../../../public/images/명수스토리4.jpg";
import storyProfileImg5 from "../../../public/images/명수스토리5.jpg";
import storyProfileImg6 from "../../../public/images/명수스토리6.jpg";
import storyProfileImg7 from "../../../public/images/명수스토리7.jpg";
import rankImg from "../../../public/images/1위.jpg";
import {
  FaPlusCircle,
  FaChevronRight,
  FaEllipsisH,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaRegComment,
  FaPaperPlane,
  FaRegPaperPlane,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import Header from "../Header";
import { useHistory } from "react-router";
import Slider from "react-slick";
import "../../css/slick.css";
import "../../css/slick-theme.css";
import { AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
import axios from "axios";
import * as fnc from "../../commonFunc/CommonFunctions";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import Modal from "../../Modal";
import CommentModal from "./CommentModal";

let page = 0;

const storys = [
  {
    src: storyProfileImg1,
    alt: "명수스토리.jpg",
  },
  {
    src: storyProfileImg2,
    alt: "명수스토리2.jpg",
  },
  {
    src: storyProfileImg3,
    alt: "명수스토리3.jpg",
  },
  {
    src: storyProfileImg4,
    alt: "명수스토리4.jpg",
  },
  {
    src: storyProfileImg5,
    alt: "명수스토리5.jpg",
  },
  {
    src: storyProfileImg6,
    alt: "명수스토리6.jpg",
  },
]; // 스토리 배열
const ranks = ["1위", "2위", "3위", "4위", "5위", "6위", "7위", "8위", "9위"];

const Home = () => {
  const history = useHistory();

  let ws = useRef(null);

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

  const [userPosts, setUserPosts] = useState([]);
  const [like, setLike] = useState(false);
  const [commentData, setCommentData] = useState({});
  const [commentModalOn, setCommentModalOn] = useState(false);
  const [inputComment, setInputComment] = useState("");
  const getLocalUserName = localStorage.getItem("username");
  const [items, setItems] = useState([]);

  // 댓글 모달 창 관련
  const onCommentModalHandler = (data) => {
    setCommentModalOn(true);
    setCommentData(data);
  };
  // 좋아요 제어
  const onLikeHandler = (data, idx) => {
    getLikeData(data, idx, (result) => {
      const likeCheck = result.likeCheck;
      const likeCount = result.likeCount;
      userPosts[idx].likeCheck = likeCheck === "true" ? true : false;
      userPosts[idx].likeCount = likeCount;
      setUserPosts([...userPosts]);
    });
  };

  // 초기 데이터 불러오기 (컨텐츠)
  const getContentData = (page) => {
    fncObj.executeQuery({
      url: "/content/getPagingList",
      data: {
        page: 0,
        size: 3,
        username: localStorage.getItem("username"),
      },
      success: (res) => {
        setUserPosts(res.content);
      },
    });
  };

  // 스크롤 했을 때 데이터 더 가져오기
  const getAddData = (page) => {
    fncObj.executeQuery({
      url: "/content/getPagingList",
      data: {
        page: page,
        size: 3,
        username: localStorage.getItem("username"),
      },
      success: (res) => {
        if (res.content.length > 0) setUserPosts(userPosts.concat(res.content));
      },
    });
  };

  // 좋아요 데이터 가져오기
  const getLikeData = (data, idx, callback) => {
    fnc.executeQuery({
      url: "content/like/save",
      data: {
        username: localStorage.getItem("username"),
        contentId: data.contentId,
      },
      success: (res) => {
        callback(res);
      },
    });
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

  useEffect(() => {
    if (getLocalUserName == undefined) {
      alert("올바르지 않은 접근");
      history.push("/");
    } else {
      getContentData();
    }
  }, []);

  //   const webSocketUrl = `ws://www.whereyedo.com:8080/eatstagram/ws/contentReply/${userPosts.contentId}`;
  const webSocketUrl = `ws://localhost:8080/eatstagram/ws/contentReply/${userPosts.contentId}`;

  // 댓글 달기 감지
  const onCommentHandler = (e) => {
    setInputComment(e.target.value);
  };

  // 댓글 게시 클릭 시
  const onClickCommentSubmit = (data) => {
    if (inputComment === "") {
      return;
    } else {
      ws.current = new WebSocket(webSocketUrl);
      ws.current.onopen = () => {
        console.log("connected to " + webSocketUrl);
        ws.current.send(
          JSON.stringify({
            roomId: data.contentId,
            username: localStorage.getItem("username"),
            msg: inputComment,
            roomType: "contentReply",
          })
        );
        ws.current.close();
      };
      ws.current.onclose = (error) => {
        console.log("disconnect from " + webSocketUrl);
        console.log(error);
      };
      ws.current.onerror = (error) => {
        console.log("connection error " + webSocketUrl);
        console.log(error);
      };
      ws.current.onmessage = (evt) => {
        const data = JSON.parse(evt.data);
        console.log(data);
      };
    }
    setInputComment("");
  };

  // 댓글 엔터로 전송 시
  //   const onKeyPress = (e) => {
  //     if (e.key == "Enter") {
  //       if (inputComment === "") {
  //         return;
  //       } else {
  //         ws.current = new WebSocket(webSocketUrl);
  //         ws.current.onopen = () => {
  //           console.log("connected to " + webSocketUrl);
  //           ws.current.send(
  //             JSON.stringify({
  //               roomId: userPosts.contentId,
  //               username: localStorage.getItem("username"),
  //               msg: inputComment,
  //               roomType: "contentReply",
  //             })
  //           );
  //           ws.current.close();
  //         };
  //         ws.current.onclose = (error) => {
  //           console.log("disconnect from " + webSocketUrl);
  //           console.log(error);
  //         };
  //         ws.current.onerror = (error) => {
  //           console.log("connection error " + webSocketUrl);
  //           console.log(error);
  //         };
  //         ws.current.onmessage = (evt) => {
  //           const data = JSON.parse(evt.data);
  //           console.log(data);
  //         };
  //       }
  //       setInputComment("");
  //     }
  //   };

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

  // 스크롤 이벤트
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <>
      <Header />
      <div className="service-screen">
        {/*스토리*/}
        <div className="main-area">
          <div className="main-area__left">
            <div className="story-area">
              <div>
                <ul className="friends-story">
                  <li className="upload-story">
                    <img src={myProfileImg} alt="묭수.jpg" />

                    <div className="upload-btn">
                      <span className="plusbtn">
                        <FaPlusCircle />
                      </span>
                    </div>
                  </li>
                  {storys.map((data, idx) => {
                    return (
                      <li key={idx}>
                        <img src={data.src} alt={data.alt} />
                      </li>
                    );
                  })}

                  <li>
                    <button>
                      <FaChevronRight />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            {/*게시글*/}
            <div className="post-area">
              {userPosts.map((data, idx) => {
                return (
                  <div className="post" key={idx}>
                    <div className="post-top">
                      <div className="post-user">
                        <div className="post-user__img">
                          <img src={storyProfileImg1} alt="" />
                        </div>
                        <div className="post-user__id">
                          <h1>{data.username}</h1>
                        </div>
                      </div>
                      <div className="post-setting">
                        <p>
                          <FaEllipsisH />
                        </p>
                      </div>
                    </div>
                    <div className="post-content">
                      <div className="post-content__main">
                        <Slider {...settings}>
                          {data.contentFileDTOList.map((data, idx) => {
                            if (
                              data.type === "image/png" ||
                              data.type === "image/jpeg"
                            ) {
                              return (
                                <img
                                  //   src={`public/upload/content/${data.name}`}
                                  src={`upload/content/${data.name}`}
                                  alt=""
                                  key={idx}
                                />
                              );
                            } else if (data.type === "video/mp4") {
                              return (
                                <video controls height="600" key={idx}>
                                  <source
                                    // src={`public/upload/content/${data.name}`}
                                    src={`upload/content/${data.name}`}
                                    type="video/mp4"
                                  />
                                </video>
                              );
                            }
                          })}
                        </Slider>
                      </div>
                    </div>
                    <div className="post-bottom">
                      <div className="post-etc">
                        <div className="post-etc__left">
                          <p>
                            {data.likeCheck ? (
                              <FaHeart
                                color="red"
                                onClick={() => onLikeHandler(data, idx)}
                              />
                            ) : (
                              <FaRegHeart
                                onClick={() => onLikeHandler(data, idx)}
                              />
                            )}
                          </p>
                          <p>
                            <FaRegComment
                              onClick={() => onCommentModalHandler(data, idx)}
                            />
                          </p>
                          <p>
                            <FaRegPaperPlane />
                          </p>
                        </div>
                        <div className="post-etc__right">
                          <p>
                            <FaRegBookmark />
                          </p>
                        </div>
                      </div>
                      <div className="post-etc2">
                        <div className="post-content__article">
                          <div className="post-content__like">
                            <p key={idx}>좋아요 {data.likeCount}개</p>
                          </div>
                          <div className="post-content__hash">
                            {data.contentHashtagDTOList.map((data, idx) => {
                              return <p key={idx}>#{data.hashtag}</p>;
                            })}
                          </div>
                          <div className="post-content__comment">
                            <div className="post-content__id">
                              <h4>whereyedo</h4>
                            </div>
                            <div className="post-content__serve">
                              <p>{data.text}</p>
                            </div>
                          </div>
                        </div>
                        <div className="post-content__time">
                          <h6>5시간 전</h6>
                        </div>
                      </div>
                      <div className="post-etc__comment">
                        <input
                          type="text"
                          placeholder="댓글 달기..."
                          value={inputComment}
                          onChange={onCommentHandler}
                        />
                        <button
                          type="button"
                          onClick={() => onClickCommentSubmit(data)}
                        >
                          게시
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/*랭킹*/}
          <div className="main-area__right">
            <div className="lank-area">
              <div className="main-user">
                <div className="main-user__img">
                  <img src={myProfileImg} alt="" />
                </div>
                <div className="main-user__id">
                  <h1>gyuxxr</h1>
                </div>
              </div>
              <div className="main-lank">
                <div className="main-lank__top">
                  <h1>현재 맛집 랭킹</h1>
                  <a>
                    <h3>모두 보기</h3>
                  </a>
                </div>
                <div className="main-lank__area">
                  {ranks.map((data, idx) => {
                    return (
                      <div className="main-lank__list" key={idx}>
                        <div className="main-lank__left">
                          <h1>{data}</h1>
                          <div className="main-lank__img">
                            <img src={rankImg} alt="" />
                          </div>
                          <div className="main-lank__info">
                            <h2>선데이버거클럽</h2>
                            <h4>패스트푸드</h4>
                          </div>
                        </div>
                        <div className="main-lank__subs">
                          <h4>구독</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default Home;
