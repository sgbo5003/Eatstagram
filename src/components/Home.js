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

// import foodImg from "../images/food.jpg";
import {
  FaPlusCircle,
  FaChevronRight,
  FaEllipsisH,
  FaHeart,
  FaComment,
  FaPaperPlane,
  FaBookmark,
} from "react-icons/fa";
import Header from "./Header";
import { useHistory } from "react-router";
import Modal from "../Modal";
import WriteModal from "./WriteModal";
import Slider from "react-slick";
import "../css/slick.css";
import "../css/slick-theme.css";
import { AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
import axios from "axios";

let page = 0;

const Home = () => {
  const history = useHistory();
  const userProfile = [
    {
      storyProfileImg: storyProfileImg1,
      userId: "whereyedo",
    },
    {
      storyProfileImg: storyProfileImg2,
      userId: "sangjun",
    },
    {
      storyProfileImg: storyProfileImg3,
      userId: "gyuxxr",
    },
  ];

  const [userPosts, setUserPosts] = useState([]);
  const [pageError, setPageError] = useState(false);
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
  //   const [buttonOn, setButtonOn] = useState(false);
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
  const [writeModalOn, setWriteModalOn] = useState(false);

  // 글쓰기 모달창 제어
  const onWriteClick = () => {
    setWriteModalOn(true);
  };

  const getData = (page) => {
    const params = new FormData();
    params.append("page", 0);
    params.append("size", 3);
    axios({
      method: "post",
      url: "/content/getPagingList",
      data: params,
    })
      .then((res) => {
        console.log(res);
        setUserPosts(res.data.content);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAddData = (page) => {
    const params = new FormData();
    params.append("page", page);
    params.append("size", 3);
    axios({
      method: "post",
      url: "/content/getPagingList",
      data: params,
    })
      .then((res) => {
        console.log(res);
        if (res.data.content.length > 0) {
          setUserPosts(userPosts.concat(res.data.content));
          setPageError(false);
        } else if (res.data.content.length === 0) {
          return setPageError(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
    console.log("렌더링 되었습니다.");
  }, []);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      if (pageError) {
        --page;
      } else {
        ++page;
      }
      getAddData(page);
      console.log(page);
      console.log(pageError);
    }
  };

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
            {userPosts.map((data, idx) => {
              return (
                <div className="post-area" key={idx}>
                  <div className="post">
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
                            <FaHeart />
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
                </div>
              );
            })}
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
                <input
                  type="button"
                  value="글쓰기"
                  style={{ marginLeft: "10px" }}
                  onClick={onWriteClick}
                />
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
      <Modal isOpen={writeModalOn} setIsOpen={setWriteModalOn}>
        <WriteModal />
      </Modal>
    </>
  );
};

export default Home;
