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
import foodImg from "../images/food.jpg";
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

const Home = () => {
  const history = useHistory();
  const posts = [
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

  const getData = () => {
    const params = new FormData();
    params.append("page", 1);
    params.append("size", 2);
    axios({
      method: "post",
      url: "/content/getPagingList",
      data: params,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

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
              {posts.map((data, idx) => {
                return (
                  <div className="post" key={idx}>
                    <div className="post-top">
                      <div className="post-user">
                        <div className="post-user__img">
                          <img src={data.storyProfileImg} alt="" />
                        </div>
                        <div className="post-user__id">
                          <h1>{data.userId}</h1>
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
                          <img src={foodImg} alt="" />
                          <video controls height="600">
                            <source
                              src="http://localhost:8080/content/stream/왜그래.mp4"
                              type="video/mp4"
                            />
                          </video>
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
                          <div className="post-content__id">
                            <h4>whereyedo</h4>
                          </div>
                          <div className="post-content__serve">
                            <p>오늘은 연하동에 갔다 왔슴다 음~ 맛 좋다~ </p>
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
