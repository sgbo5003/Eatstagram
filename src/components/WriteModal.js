import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaTimes,
  FaMapMarkerAlt,
  FaHashtag,
} from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import foodImg from "../images/food.jpg";
import myProfileImg from "../images/묭수.jpg";
import WriteDefaultImg from "../images/write_default_image.png";

const WriteModal = () => {
  //   const { setWriteModalOn } = props;

  const category = [
    "한식",
    "양식",
    "일식",
    "중식",
    "아시안",
    "디저트",
    "치킨·피자·햄버거",
    "분식",
    "야식",
  ];

  const [content, setContent] = useState(""); // 글작성 - 글쓰기 부분
  const [inputHash, setInputHash] = useState(""); // 글작성 - 해쉬태그 input
  const [hashList, setHashList] = useState([]); // 해쉬태그를 담는 배열
  const [categoryList, setCategoryList] = useState(new Set()); // 카테고리
  const [userImg, setUserImg] = useState([]); // 유저가 올린 이미지
  const [fileImg, setFileImg] = useState(null); // 파일 업로드 할 이미지

  // 모달 창 닫기 버튼
  //   const exitModalHandler = () => {
  //     setWriteModalOn(false);
  //     setHashList([]);
  //     setInputHash("");
  //     setContent("");
  //   };
  // 글작성 textarea부분
  const onContentHandler = (e) => {
    setContent(e.target.value);
  };
  // 해시태그 input부분
  const onInputHashHandler = (e) => {
    setInputHash(e.target.value);
  };
  // 해시태그 추가 기능
  const onHashAddHandler = () => {
    if (inputHash == "") {
      return;
    } else if (hashList.includes(inputHash)) {
      return;
    } else {
      setHashList(hashList.concat(inputHash));
    }
    console.log(hashList);
    setInputHash("");
  };
  // 해시태그 제거 기능
  const onHashDeleteHandler = (data) => {
    const newHashList = hashList.filter((el) => el !== data);
    setHashList(newHashList);
  };

  //카테고리 버튼 색상변경 핸들러
  const onCategoryListHandler = (data) => {
    let itemSet = new Set(categoryList);
    if (categoryList.has(data)) {
      itemSet.delete(data);
      setCategoryList(itemSet);
    } else {
      itemSet.add(data);
      setCategoryList(itemSet);
    }
    console.log(categoryList);
  };

  // 이미지 변경 제어
  const onChangeImg = (e) => {
    if (e.target.files[0]) {
      //   console.log("picture", e.target.files[0]);
      setFileImg(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = function (e) {
        setUserImg(userImg.concat(e.target.result));
        // setUserImg(e.target.result);
        console.log(userImg);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  /*userImg.length === 0
                      ? WriteDefaultImg
                      : userImg.map((data, idx) => {
                          return data[idx];
                        }) */

  return (
    <div className="write-window">
      <div className="write-area">
        <div className="wirte-area__top">
          <p>작성</p>
          <button>
            <FaTimes />
          </button>
        </div>
        <div className="write-area__bottom">
          <div className="write-left">
            <div className="write-contents">
              <div className="write-contnets__main">
                {userImg.length === 0 ? (
                  <img src={WriteDefaultImg} alt="기본 이미지" />
                ) : (
                  userImg.map((data, idx) => {
                    return <img src={data} alt="이미지" key={idx} />;
                  })
                )}
              </div>
            </div>
            <div className="write-upload">
              {/* <div className="write-upload__img">
                <img src={foodImg} alt="" />
              </div> */}
              <div className="write-upload__plus">
                <input
                  type="file"
                  id="getfile"
                  accept="image/*"
                  onChange={onChangeImg}
                />
                <label htmlFor="getfile">
                  <BsPlus className="write-upload-plus-icon" />
                </label>
              </div>
            </div>
          </div>
          <div className="write-right">
            <div className="write-user">
              <div className="write-user__img">
                <img src={myProfileImg} alt="" />
              </div>
              <div className="write-user__id">
                <h1>gyuxxr</h1>
              </div>
            </div>
            <div className="write-text">
              <textarea
                name=""
                cols="100"
                rows="100"
                placeholder="설명을 입력하세요.."
                value={content}
                onChange={onContentHandler}
              />
            </div>
            <div className="write-item">
              <div className="write-map">
                <h1>위치 추가...</h1>
                <button>
                  <FaMapMarkerAlt />
                </button>
              </div>
              <div className="write-hashtag">
                <h1>해시태그</h1>
                <div className="write-hashtag__input">
                  <input
                    type="text"
                    value={inputHash}
                    onChange={onInputHashHandler}
                  />
                  <input
                    type="button"
                    value="추가"
                    onClick={onHashAddHandler}
                  />
                  <FaHashtag className="write-hashtag-icon" />
                  <div className="write-hashtag-hashlist">
                    {hashList.map((data, idx) => {
                      return (
                        <div className="write-hashtag__into" key={idx}>
                          <h4># {data}</h4>
                          <button onClick={() => onHashDeleteHandler(data)}>
                            X
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="write-category">
                <h1>카테고리</h1>
                <div id="food-category">
                  {category.map((data, idx) => {
                    return (
                      <div className="category-row" key={idx}>
                        <button
                          className={categoryList.has(data) ? "selected" : ""}
                          onClick={() => onCategoryListHandler(data)}
                        >
                          {data}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="write-btn">
                <button>공유하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteModal;
