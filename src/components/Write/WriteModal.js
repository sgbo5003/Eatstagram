import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaTimes,
  FaMapMarkerAlt,
  FaHashtag,
} from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import myProfileImg from "../../../public/images/묭수.jpg";
import WriteDefaultImg from "../../../public/images/write_default_image.png";
import axios from "axios";
import Qmenu from "./Qmenu";
import Modal from "../../Modal";
import WriteExitConfirmModal from "./WriteExitConfirmModal";
import { useHistory } from "react-router";

const WriteModal = () => {
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
  const history = useHistory();
  const [content, setContent] = useState(""); // 글작성 - 글쓰기 부분
  const [userLocation, setUserLocation] = useState(""); // 위치
  const [locationList, setLocationList] = useState([]); // 카카오 맵 위치 data list
  const [inputHash, setInputHash] = useState(""); // 글작성 - 해쉬태그 input
  const [hashList, setHashList] = useState([]); // 해쉬태그를 담는 배열
  const [categoryList, setCategoryList] = useState(new Set()); // 카테고리
  const [userImg, setUserImg] = useState([]); // 유저가 올린 이미지(하단)
  const [userImgList, setUserImgList] = useState([]); // 유저가 올린 이미지 & 동영상(상단)
  const [videoImg, setVideoImg] = useState([]); // 유저가 올린 동영상(하단)
  const [fileImg, setFileImg] = useState([]); // 파일 업로드 할 이미지
  const [modalOn, setModalOn] = useState(false); // 글 작성창 -> x 표시 클릭 -> 확인하는 모달창 on
  const [isDropClick, setIsDropClick] = useState(false); // Qmenu ON & OFF

  // 글작성 textarea부분
  const onContentHandler = (e) => {
    setContent(e.target.value);
  };
  // 위치 input 부분
  const onUserLocationHandler = (e) => {
    setUserLocation(e.target.value);
  };
  // 해시태그 input부분
  const onInputHashHandler = (e) => {
    setInputHash(e.target.value);
  };
  // 해시태그 추가 기능
  const onHashAddHandler = () => {
    if (inputHash === "" || inputHash.trim() === "") {
      return;
    } else if (hashList.includes(inputHash)) {
      return;
    } else {
      setHashList(hashList.concat(inputHash));
    }
    setInputHash("");
  };
  // 해시태그 엔터해서 추가
  const onHashKeyPress = (e) => {
    if (e.key == "Enter") {
      if (inputHash === "" || inputHash.trim() === "") {
        return;
      } else if (hashList.includes(inputHash)) {
        return;
      } else {
        setHashList(hashList.concat(inputHash));
        setInputHash("");
      }
    }
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
  };

  // 이미지 변경 제어
  const onChangeImg = (e) => {
    // 이미지 -> type : image/png, image/jpeg
    // 동영상 -> type : video/mp4
    const fileType = e.target.files[0].type;
    if (e.target.files[0]) {
      setFileImg(fileImg.concat(e.target.files[0]));
      const reader = new FileReader();
      reader.onload = function (e) {
        if (fileType === "image/png" || fileType === "image/jpeg") {
          setUserImgList(
            userImgList.concat({ type: "image", result: e.target.result })
          );
          setUserImg(
            userImg.concat({ type: "image", result: e.target.result })
          );
        } else if (fileType === "video/mp4") {
          setUserImgList(
            userImgList.concat({ type: "video", result: e.target.result })
          );
          setVideoImg(
            videoImg.concat({ type: "video", result: e.target.result })
          );
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    console.log(fileImg);
  };

  // 하단 이미지 선택 시
  const onImgClickHandler = (data) => {
    setUserImgList([data]);
  };
  // 카카오맵 검색어 찾기
  const kakaoMap = () => {
    const data = encodeURI(userLocation);
    axios({
      method: "get",
      url: `https://dapi.kakao.com/v2/local/search/keyword.json?query=${data}`,
      headers: { Authorization: "KakaoAK 5e407f97877a18e777c7ef12779007da" },
    })
      .then((response) => {
        console.log(response);
        console.log(response.data.documents); // 검색결과 []
        setLocationList(response.data.documents);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onLocationClick = () => {
    kakaoMap();
    setIsDropClick(true);
  };

  const sendData = () => {
    const categoryArray = [...categoryList];
    const paramsData = new FormData();
    paramsData.append("text", content); // 글쓰기 text
    paramsData.append("location", userLocation); // 위치
    paramsData.append("username", localStorage.getItem("username")); // 유저 아이디
    for (let i = 0; i < hashList.length; i++) {
      paramsData.append(`contentHashtagDTOList[${i}].hashtag`, hashList[i]);
    } // 해쉬태그
    for (let i = 0; i < categoryArray.length; i++) {
      paramsData.append(
        `contentCategoryDTOList[${i}].category`,
        categoryArray[i]
      );
    } // 카테고리
    for (let i = 0; i < fileImg.length; i++) {
      paramsData.append("uploadFiles", fileImg[i]);
    } // 이미지 & 동영상 파일

    axios({
      method: "post",
      //   url: "http://www.whereyedo.com:55808/eatstagram/content/add",
      url: "http://localhost:8080/eatstagram/content/add",
      data: paramsData,
    })
      .then((response) => {
        if (response.data.response == "ok") {
          alert("글쓰기 성공");
          location.reload();
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = () => {
    // 해시태그 => 필수 x
    if (
      content == "" ||
      fileImg.length == 0 ||
      userLocation == "" ||
      categoryList.length == 0
    ) {
      alert("error");
    } else {
      sendData();
    }
  };

  const onExitButtonHandler = () => {
    setModalOn(true);
  };

  const onExitModalHandler = () => {
    history.push("/");
    location.reload();
  };

  return (
    <>
      <div className="write-window">
        <div className="write-area">
          <div className="wirte-area__top">
            <p>작성</p>
            <button>
              <FaTimes onClick={onExitButtonHandler} />
            </button>
          </div>
          <div className="write-area__bottom">
            <div className="write-left">
              <div className="write-contents">
                <div className="write-contnets__main">
                  {fileImg.length === 0 ? (
                    <img src={WriteDefaultImg} alt="기본 이미지" />
                  ) : (
                    userImgList.map((data, idx) => {
                      if (data.type === "image") {
                        return <img src={data.result} alt="이미지" key={idx} />;
                      } else if (data.type === "video") {
                        return (
                          <video controls width="500" height="500" key={idx}>
                            <source src={data.result} type="video/mp4" />
                          </video>
                        );
                      } else {
                        return;
                      }
                    })
                  )}
                </div>
              </div>
              <div className="write-upload">
                {userImg.length === 0
                  ? ""
                  : userImg.map((data, idx) => {
                      return (
                        <div
                          className="write-upload__plus"
                          onClick={() => onImgClickHandler(data)}
                          key={idx}
                        >
                          <img src={data.result} alt="이미지" />
                        </div>
                      );
                    })}
                {videoImg.length === 0
                  ? ""
                  : videoImg.map((data, idx) => {
                      return (
                        <div
                          className="write-upload__plus"
                          onClick={() => onImgClickHandler(data)}
                          key={idx}
                        >
                          <video controls>
                            <source src={data.result} type="video/mp4" />
                          </video>
                        </div>
                      );
                    })}
                <div className="write-upload__plus">
                  <input
                    type="file"
                    id="getfile"
                    accept="image/*, video/*"
                    onChange={onChangeImg}
                    multiple
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
                  <input
                    type="text"
                    placeholder="위치 추가..."
                    value={userLocation}
                    onChange={onUserLocationHandler}
                  />

                  <button onClick={onLocationClick}>
                    <FaMapMarkerAlt />
                  </button>
                </div>
                {isDropClick && (
                  <Qmenu
                    locationList={locationList}
                    setLocationList={setLocationList}
                    setUserLocation={setUserLocation}
                    setIsDropClick={setIsDropClick}
                  />
                )}
                <div className="write-hashtag">
                  <h1>해시태그</h1>
                  <div className="write-hashtag__input">
                    <input
                      type="text"
                      value={inputHash}
                      onChange={onInputHashHandler}
                      onKeyPress={onHashKeyPress}
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
                  <button onClick={onSubmit}>공유하기</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={modalOn} setIsOpen={setModalOn}>
        <WriteExitConfirmModal setModalOn={setModalOn} />
      </Modal>
    </>
  );
};

export default WriteModal;
