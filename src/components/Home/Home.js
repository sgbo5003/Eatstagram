import React, { useEffect, useRef, useState } from "react";
import defaultImg from "../../../public/images/default_user.png";
import myProfileImg from "../../../public/images/묭수.jpg";
import storyProfileImg1 from "../../../public/images/명수스토리.jpg";
import storyProfileImg2 from "../../../public/images/명수스토리2.jpg";
import storyProfileImg3 from "../../../public/images/명수스토리3.jpg";
import storyProfileImg4 from "../../../public/images/명수스토리4.jpg";
import storyProfileImg5 from "../../../public/images/명수스토리5.jpg";
import storyProfileImg6 from "../../../public/images/명수스토리6.jpg";
import storyProfileImg7 from "../../../public/images/명수스토리7.jpg";
import profileDefaultImg from "../../../public/images/default_user.png";
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
  FaCamera,
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
import ShareModal from "./ShareModal";
import MyPostModal from "./MyPostModal";
import OtherPostModal from "./OtherPostModal";

let page = 0;
// 스토리 배열
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
];

const Home = (props) => {
  const { profileFilePath, contentFilePath } = props;
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
  const [shareModalOn, setShareModalOn] = useState(false);
  const [myPostModalOn, setMyPostModalOn] = useState(false);
  const [myPostData, setMyPostData] = useState({});
  const [otherPostData, setOtherPostData] = useState({});
  const [otherPostModalOn, setOtherPostModalOn] = useState(false);
  const [inputComment, setInputComment] = useState("");
  const [profileData, setProfileData] = useState({}); // 프로필 data
  const [follow, setFollow] = useState("");
  const [follower, setFollower] = useState("");
  const [items, setItems] = useState([]);
  const [contentId, setContentId] = useState("");
  const [contentFile, setContentFile] = useState("");
  const [rankingList, setRankingList] = useState([]);
  const getLocalUserName = localStorage.getItem("username");
  const getLocalUserNickName = localStorage.getItem("userNickname");

  // 랭킹페이지 이동
  const onRankingHandler = () => {
    history.push("/Ranking");
  };

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
  // 저장 제어
  const onSaveHandler = (data, idx) => {
    getSaveData(data, idx, (result) => {
      const savedYn = result.savedYn;
      userPosts[idx].savedYn = savedYn;
      setUserPosts([...userPosts]);
    });
  };

  // 게시글 공유 창 관련
  const onShareModalHandler = (data) => {
    setShareModalOn(true);
    setContentId(data.contentId);
    setContentFile(data.contentFileDTOList[0].name);
  };

  // 팔로우 했는지 여부
  const getFollowYnData = (data) => {
    fnc.executeQuery({
      url: "follow/getFollowYn",
      data: {
        username: getLocalUserName,
        target: data.username,
      },
      success: (res) => {
        setFollow(res.followYn);
      },
    });
  };

  // 팔로워 했는지 여부
  const getFollowerYnData = (data) => {
    fnc.executeQuery({
      url: "follower/getFollowerYn",
      data: {
        username: getLocalUserName,
        target: data.username,
      },
      success: (res) => {
        setFollower(res.followerYn);
      },
    });
  };

  // 내 게시물 & 다른사람 게시물 더보기 클릭 시
  const onPostClick = (data) => {
    if (data.username === getLocalUserName) {
      setMyPostModalOn(true);
      setMyPostData(data);
    } else {
      setOtherPostModalOn(true);
      setOtherPostData(data);
      getFollowYnData(data);
      getFollowerYnData(data);
    }
  };

  // 초기 데이터 불러오기 (컨텐츠)
  const getContentData = () => {
    fncObj.executeQuery({
      url: "/content/getPagingList",
      data: {
        page: 0,
        size: 3,
        username: getLocalUserName,
      },
      success: (res) => {
        res.content.map((item, idx) => {
          getRegdate(item);
        });
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
        username: getLocalUserName,
      },
      success: (res) => {
        if (res.content.length > 0) {
          res.content.map((item, idx) => {
            getRegdate(item);
          });
          setUserPosts(userPosts.concat(res.content));
        }
      },
    });
  };

  // 좋아요 데이터 가져오기
  const getLikeData = (data, idx, callback) => {
    fnc.executeQuery({
      url: "content/like/save",
      data: {
        username: getLocalUserName,
        contentId: data.contentId,
      },
      success: (res) => {
        callback(res);
      },
      fail: (res) => {
        alert(res.data.msg);
      },
    });
  };

  // 저장 데이터 가져오기
  const getSaveData = (data, idx, callback) => {
    fnc.executeQuery({
      url: "content/save",
      data: {
        username: getLocalUserName,
        contentId: data.contentId,
      },
      success: (res) => {
        callback(res);
      },
      fail: (res) => {
        alert(res.data.msg);
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
      // alert("올바르지 않은 접근");
      history.push("/");
    } else {
      page = 0;
      getContentData();
      getProfileData();
      getRankingData();
    }
  }, []);

  // 댓글 달기 감지
  const onCommentHandler = (e) => {
    setInputComment(e.target.value);
  };

  // 댓글 게시 클릭 시
  const onClickCommentSubmit = (data) => {
    //   const webSocketUrl = `ws://www.whereyedo.com:55808/eatstagram/ws/contentReply/${data.contentId}`;
    const webSocketUrl = `ws://www.whereyedo.com:55808/eatstagram/ws/contentReply/${data.contentId}`;
    if (inputComment === "" || inputComment.trim() === "") {
      return;
    } else {
      ws.current = new WebSocket(webSocketUrl);
      ws.current.onopen = () => {
        console.log("connected to " + webSocketUrl);
        ws.current.send(
          JSON.stringify({
            roomId: data.contentId,
            username: getLocalUserName,
            nickname: getLocalUserNickName,
            msg: inputComment,
            roomType: "contentReply",
            type: "text",
          })
        );
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
        ws.current.close();
      };
    }
    setInputComment("");
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

  const getProfileData = () => {
    fncObj.executeQuery({
      url: "getMemberInfo",
      data: {
        username: getLocalUserName,
      },
      success: (res) => {
        setProfileData(res);
      },
    });
  };

  const onProfileClick = (data) => {
    history.push(`/Profile?username=${data.username}`);
  };

  const getRankingData = () => {
    fncObj.executeQuery({
      url: "getRankingPagingList",
      data: {
        page: 0,
        size: 10,
        username: getLocalUserName,
      },
      success: (res) => {
        setRankingList(res.content);
      },
    });
  };

  // 팔로우 추가 및 삭제
  const sendFollowYnData = (data, idx) => {
    fnc.executeQuery({
      url: "follow/save",
      data: {
        username: getLocalUserName,
        target: data,
      },
      success: (res) => {
        const newList = [...rankingList];
        newList[idx].followYn = res.followYn;
        setRankingList(newList);
      },
    });
  };

  // 맞팔 & 언팔 & 팔로우 버튼 클릭 시
  const FollowBtnClick = (data, idx) => {
    sendFollowYnData(data.username, idx);
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
      <div className="service-screen">
        {/*스토리*/}
        <div className="main-area">
          <div className="main-position">
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
                {userPosts.length < 1 ? (
                  <div className="post-empty">
                    <h1>
                      <FaCamera className="i" />
                    </h1>
                    <h1>게시물 없음</h1>
                  </div>
                ) : (
                  userPosts.map((data, idx) => {
                    return (
                      <div className="post" key={idx}>
                        <div className="post-top">
                          <div className="post-user">
                            <div className="post-user__img">
                              <img
                                src={
                                  data.profileImgName === null
                                    ? profileDefaultImg
                                    : profileFilePath + data.profileImgName
                                }
                                alt=""
                                onClick={() => onProfileClick(data)}
                              />
                            </div>
                            <div
                              className="post-user__id"
                              onClick={() => onProfileClick(data)}
                            >
                              <h1>{data.nickname}</h1>
                              <h4>{data.location}</h4>
                            </div>
                          </div>
                          <div className="post-setting">
                            <p onClick={() => onPostClick(data)}>
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
                                      src={contentFilePath + data.name}
                                      alt=""
                                      key={idx}
                                    />
                                  );
                                } else if (data.type === "video/mp4") {
                                  return (
                                    <video controls height="600" key={idx}>
                                      <source
                                        src={contentFilePath + data.name}
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
                                  onClick={() =>
                                    onCommentModalHandler(data, idx)
                                  }
                                />
                              </p>
                              <p>
                                <FaRegPaperPlane
                                  onClick={() => onShareModalHandler(data)}
                                />
                              </p>
                            </div>
                            <div className="post-etc__right">
                              <p>
                                {data.savedYn === "Y" ? (
                                  <FaBookmark
                                    onClick={() => onSaveHandler(data, idx)}
                                  />
                                ) : (
                                  <FaRegBookmark
                                    onClick={() => onSaveHandler(data, idx)}
                                  />
                                )}
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
                              <div className="post-content__article">
                                <div className="post-content__id">
                                  <h4>{data.nickname}</h4>
                                </div>
                                <div className="post-content__serve">
                                  <p>{data.text}</p>
                                </div>
                              </div>
                            </div>
                            <div className="post-content__time">
                              <h6>{data.time}</h6>
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
                  })
                )}
              </div>
            </div>
            {/*랭킹*/}
            <div className="main-area__right">
              <div className="lank-area">
                <div className="main-user">
                  <div className="main-user__img">
                    <img
                      src={
                        profileData.profileImgName === null
                          ? profileDefaultImg
                          : profileFilePath + profileData.profileImgName
                      }
                      alt=""
                      onClick={() => onProfileClick(profileData)}
                    />
                  </div>
                  <div className="main-user__id">
                    <h1 onClick={() => onProfileClick(profileData)}>
                      {getLocalUserNickName}
                    </h1>
                    <h3 onClick={() => onProfileClick(profileData)}>
                      {profileData.name}
                    </h3>
                  </div>
                </div>
                <div className="main-lank">
                  <div className="main-lank__top">
                    <h1>팔로워 랭킹</h1>
                    <a>
                      <h3 onClick={onRankingHandler}>모두 보기</h3>
                    </a>
                  </div>
                  <div className="main-lank__area">
                    {rankingList.map((data, idx) => {
                      return (
                        <div className="main-lank__list" key={idx}>
                          <div
                            className="main-lank__left"
                            onClick={() => onProfileClick(data)}
                          >
                            <h1>{idx + 1}</h1>
                            <div className="main-lank__img">
                              <img
                                src={
                                  data.profileImgName === null
                                    ? profileDefaultImg
                                    : profileFilePath + data.profileImgName
                                }
                                alt=""
                              />
                            </div>
                            <div className="main-lank__info">
                              <h2>{data.nickname}</h2>
                              <h4>{data.name}</h4>
                            </div>
                          </div>
                          <div className="main-lank__subs">
                            {getLocalUserName === data.username ? (
                              ""
                            ) : data.followYn === "N" &&
                              data.followerYn === "Y" ? (
                              <h4 onClick={() => FollowBtnClick(data, idx)}>
                                맞팔로우
                              </h4>
                            ) : (data.followYn === "Y" &&
                                data.followerYn === "Y") ||
                              (data.followYn === "Y" &&
                                data.followerYn === "N") ? (
                              <h4 onClick={() => FollowBtnClick(data, idx)}>
                                언팔로우
                              </h4>
                            ) : (
                              <h4 onClick={() => FollowBtnClick(data, idx)}>
                                팔로우
                              </h4>
                            )}
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
      </div>
      <Modal isOpen={commentModalOn} setIsOpen={setCommentModalOn}>
        <CommentModal
          commentData={commentData}
          setCommentModalOn={setCommentModalOn}
          items={items}
          setItems={setItems}
          getRegdate={getRegdate}
          settings={settings}
          onProfileClick={onProfileClick}
          profileFilePath={profileFilePath}
          contentFilePath={contentFilePath}
        />
      </Modal>
      <Modal isOpen={shareModalOn} setIsOpen={setShareModalOn}>
        <ShareModal
          setShareModalOn={setShareModalOn}
          ws={ws}
          contentId={contentId}
          contentFile={contentFile}
          profileFilePath={profileFilePath}
        />
      </Modal>
      <Modal isOpen={myPostModalOn} setIsOpen={setMyPostModalOn}>
        <MyPostModal
          myPostData={myPostData}
          setMyPostModalOn={setMyPostModalOn}
        />
      </Modal>
      <Modal isOpen={otherPostModalOn} setIsOpen={setOtherPostModalOn}>
        <OtherPostModal
          setOtherPostModalOn={setOtherPostModalOn}
          otherPostData={otherPostData}
          getLocalUserName={getLocalUserName}
          follow={follow}
          follower={follower}
          setFollow={setFollow}
        />
      </Modal>
    </>
  );
};

export default Home;
