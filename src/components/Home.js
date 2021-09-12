import React, { useEffect, useState } from "react";
import myProfileImg from "../images/묭수.jpg";
import storyProfileImg1 from "../images/명수스토리.jpg";
import storyProfileImg2 from "../images/명수스토리2.jpg";
import storyProfileImg3 from "../images/명수스토리3.jpg";
import storyProfileImg4 from "../images/명수스토리4.jpg";
import storyProfileImg5 from "../images/명수스토리5.jpg";
import storyProfileImg6 from "../images/명수스토리6.jpg";
import storyProfileImg7 from "../images/명수스토리7.jpg";
import rankImg from "../images/1위.jpg";
import {
  FaPlusCircle,
  FaChevronRight,
  FaEllipsisH,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaPaperPlane,
  FaBookmark,
} from "react-icons/fa";
import Header from "./Header";
import { useHistory } from "react-router";
import Slider from "react-slick";
import "../css/slick.css";
import "../css/slick-theme.css";
import { AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
import axios from "axios";
import * as fnc from "../commonFunc/CommonFunctions";
import * as fncObj from "../commonFunc/CommonObjFunctions";

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
];
const ranks = ["1위", "2위", "3위", "4위", "5위", "6위", "7위", "8위", "9위"];

const Home = () => {
  const history = useHistory();
  // Slider 세팅
  const settings = {
    dots: true, // 캐러셀의 점을 보여줄 것인지
    infinite: true, // 마지막 장 다음에 첫번째가 나오게 할 것인지
    speed: 500, // 넘어가는 속도는 몇으로 할 것인지
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <AiFillRightCircle color="#ffffff" />,
    prevArrow: <AiFillLeftCircle color="#ffffff" />,
  };
  const [userData, setUserData] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [likeCheck, setLikeCheck] = useState(false);

  const onLikeHandler = (data, idx) => {
    getLikeData(data, idx);
  };

  const getContentData = (page) => {
    fncObj.executeQuery({
      url: "/content/getPagingList",
      data: {
        page: 0,
        size: 3,
      },
      success: (res) => {
        setUserPosts(res.content);
      },
    });
  };

  const getAddData = (page) => {
    fncObj.executeQuery({
      url: "/content/getPagingList",
      data: {
        page: page,
        size: 3,
      },
      success: (res) => {
        if (res.content.length > 0) setUserPosts(userPosts.concat(res.content));
      },
    });
  };

  const getUserData = () => {
    fncObj.executeQuery({
      url: "getUser",
      data: {},
      success: (res) => {
        setUserData(res);
        sessionStorage.setItem("username", res.username);
      },
    });
  };

  const getLikeData = (data, idx) => {
    fnc.executeQuery({
      url: "contentLike/save",
      data: {
        username: sessionStorage.getItem("username"),
        contentId: data.contentId,
      },
      success: (res) => {
        setLikeCheck(res.likeCheck);
      },
    });
  };

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
    getUserData();
  }, []);

  useEffect(() => {
    getContentData();
  }, [likeCheck]);

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
                            if (data.type === "image/png") {
                              return (
                                <img
                                  src={`/images/${data.name}`}
                                  alt=""
                                  key={idx}
                                />
                              );
                            } else if (data.type === "video/mp4") {
                              return (
                                <video controls height="600" key={idx}>
                                  <source
                                    // src="http://localhost:8080/content/stream/왜그래.mp4"
                                    src={`/images/${data.name}`}
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
                            {data.likeCheck === true ? (
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
                            <FaComment />
                          </p>
                          <p>
                            <FaPaperPlane />
                          </p>
                        </div>
                        <div className="post-etc__right">
                          <p>
                            <FaBookmark />
                          </p>
                        </div>
                      </div>
                      <div className="post-etc2">
                        <div className="post-content__article">
                          <div className="post-content__like">
                            <p key={idx}>좋아요 {data.likeCount}개</p>
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
                          <h6>5시간 전</h6>
                        </div>
                      </div>
                      <div className="post-etc__comment">
                        <input type="text" placeholder="댓글 달기..." />
                        <button type="submit">게시</button>
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
                  <h1>현재 맛집 랭킹</h1>
                  <a>
                    <h3>모두 보기</h3>
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
    </>
  );
};

export default Home;
