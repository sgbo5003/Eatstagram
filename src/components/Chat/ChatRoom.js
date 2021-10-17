import React, { useEffect, useRef, useState } from "react";
import { FaImage, FaRegImage, FaHeart, FaRegHeart } from "react-icons/fa";
import { AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
import { MdExitToApp } from "react-icons/md";
import storyProfileImg1 from "../../../public/images/명수스토리.jpg";
import profileDefaultImg from "../../../public/images/default_user.png";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import Header from "../Header";
import Chat from "./Chat";
import { useHistory } from "react-router";
import Modal from "../../Modal";
import ChatExitModal from "./ChatExitModal";
import CommentModal from "../Home/CommentModal";

let page = 0;

const ChatRoom = (props) => {
  const {
    paramsId,
    setUpdateChatList,
    updateChatList,
    userInfo,
    profileFilePath,
    contentFilePath,
    dmFilePath,
  } = props;
  const history = useHistory();
  const localUserName = localStorage.getItem("username");
  // const webSocketUrl = `ws://www.whereyedo.com:55808/eatstagram/ws/directMessage/${paramsId}`;
  const webSocketUrl = `ws://www.whereyedo.com:55808/eatstagram/ws/directMessage/${paramsId}?username=${localUserName}`;
  let ws = useRef(null);
  const scrollRef = useRef(null);
  const [inputText, setInputText] = useState(""); // input 부분
  const [myChatBox, setMyChatBox] = useState([]); // 나의 메세지를 담는 배열
  const [friendChatBox, setFriendChatBox] = useState([]); // 상대 메세지를 담는 배열
  const [chatList, setChatList] = useState([]); // 받아온 채팅 리스트
  const [isDone, setIsDone] = useState(false); // 스크롤해서 데이터 가져오고 난뒤 체크
  const [image, setImage] = useState(null); // 이미지 파일
  const [chatExitModalOn, setChatExitModalOn] = useState(false);
  const [commentModalOn, setCommentModalOn] = useState(false);
  const [commentData, setCommentData] = useState({});
  const [items, setItems] = useState([]);
  const [time, setTime] = useState("");
  let uploadUserName;

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

  // 이미지 핸들러
  const onImageHandler = (e) => {
    const maxSize = 2000000; // 2MB
    // setImage(e.target.files[0]);
    const imageFile = e.target.files[0];
    const fileReader = new FileReader();
    if (imageFile.size > maxSize) {
      alert("파일 용량은 2MB까지만 가능합니다.");
    } else {
      fileReader.onload = function (e) {
        ws.current.send(
          JSON.stringify({
            msg: imageFile.name,
            type: "file",
            file: imageFile,
            roomType: "directMessage",
            roomId: paramsId,
            username: localUserName,
          })
        );
        const arrayBuffer = e.target.result;
        ws.current.send(arrayBuffer);
      };
      fileReader.readAsArrayBuffer(imageFile);
    }
  };
  // 채팅 입력
  const onInputTextHandler = (e) => {
    setInputText(e.target.value);
  };

  // 채팅 입력 (Enter키)
  const onKeyPress = (e) => {
    if (e.key == "Enter") {
      if (inputText === "" || inputText.trim() === "") {
        return;
      } else {
        // 값이 있으면 chatBox 배열에 inputText 추가
        // 텍스트면 type: "text", 사진이면 type: "file" <- 내가 지정한대로 반환되어 온다
        ws.current.send(
          JSON.stringify({
            msg: inputText,
            type: "text",
            roomType: "directMessage",
            roomId: paramsId,
            username: localUserName,
          })
        );
      }
      // 채팅을 보내면 input 비워주기
      setInputText("");
    } else {
      return;
    }
  };

  // 채팅 연결 되었는지 체크
  const chatConnectCheck = (data) => {
    fncObj.executeQuery({
      url: "directMessageRoomMember/updateConnectionYn",
      data: {
        directMessageRoomId: paramsId,
        username: localUserName,
        connectionYn: data,
      },
      success: (res) => {},
    });
  };

  useEffect(() => {
    page = 0;
    setIsDone(false);
    ws.current = new WebSocket(webSocketUrl);
    ws.current.onopen = () => {
      console.log("connected to " + webSocketUrl);
      getChatData();
      // db에 connectionStatusYn: Y 전달 -> 채팅방에 접속중인지 조회
      chatConnectCheck("Y");
    };
    ws.current.onclose = (error) => {
      console.log("disconnect from " + webSocketUrl);
      console.log(error);
      // db에 connectionStatusYn: N 전달 -> 채팅방에 접속중인지 조회
      setUpdateChatList(false);
      chatConnectCheck("N");
    };
    ws.current.onerror = (error) => {
      console.log("connection error " + webSocketUrl);
      console.log(error);
    };
    ws.current.onmessage = (evt) => {
      if (evt.data.size) {
        const msg = evt.data;
        const url = URL.createObjectURL(new Blob([msg]));
        const obj = {};
        obj.type = "file";
        obj.msg = url;
        obj.username = uploadUserName;
        setMyChatBox((prevItems) => [...prevItems, obj]);
      } else {
        const data = JSON.parse(evt.data);
        if (updateChatList === false) {
          setUpdateChatList(true);
        }
        if (data.type === "file") {
          uploadUserName = data.username;
        } else {
          getRegdate(data);
          setMyChatBox((prevItems) => [...prevItems, data]);
        }
      }
      scrollToBottom();
    };
    return () => {
      console.log("clean up");
      ws.current.close();
    };
  }, [location.href]);

  // 채팅 가져오기
  const getChatData = () => {
    fncObj.executeQuery({
      url: "directMessage/getPagingList",
      data: {
        page: 0,
        size: 13,
        directMessageRoomId: paramsId,
        username: localUserName,
      },
      success: (res) => {
        res.content.map((item, idx) => {
          getRegdate(item);
        });
        setChatList(res.content);
        initialScrollPosition();
      },
    });
  };

  const getAddChatData = (page) => {
    fncObj.executeQuery({
      url: "directMessage/getPagingList",
      data: {
        page: page,
        size: 7,
        directMessageRoomId: paramsId,
        username: localUserName,
      },
      success: (res) => {
        if (res.content.length > 0) {
          setChatList(chatList.concat(res.content));
        } else {
          setIsDone(true);
        }
      },
    });
  };

  // 스크롤 감지
  const handleScroll = () => {
    const scrollTop = scrollRef.current.scrollTop; // 스크롤 상단으로부터의 위치
    if (!isDone) {
      if (scrollTop === 0) {
        ++page;
        getAddChatData(page);
        scrollUpdate();
      }
    } else {
      return;
    }
  };

  // 스크롤 이벤트
  useEffect(() => {
    scrollRef.current.addEventListener("scroll", handleScroll);
    return () => {
      if (scrollRef.current !== null) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  });

  // 스크롤 젤 위에 도달 시, 채팅 더 가져오고 스크롤 내리기
  const scrollUpdate = () => {
    scrollRef.current.scrollTo({ top: 100, behavior: "smooth" });
  };

  // 채팅을 보낸 후 스크롤 젤 하단으로 내리기
  const scrollToBottom = () => {
    const scrollHeight = scrollRef.current.scrollHeight;
    scrollRef.current.scrollTo({
      top: scrollHeight,
    });
  };

  // 처음 스크롤 젤 하단으로 내리기
  const initialScrollPosition = () => {
    scrollRef.current.scrollTop = 10000;
  };

  // 채팅방 나가기 모달 띄우기
  const onChatExitModalHandler = () => {
    setChatExitModalOn(true);
  };

  const onCommentModalHandler = (data, jsonData) => {
    setTime(data.time);
    setCommentData(jsonData);
    setCommentModalOn(true);
  };

  const onWebSocketCommentModalHandler = (data) => {
    setCommentData(data);
    setCommentModalOn(true);
  };

  const onProfileClick = (data) => {
    if (data.directMessageRoomMemberDTOList.length === 2) {
      history.push(
        `/Profile?username=${data.directMessageRoomMemberDTOList[1].username}`
      );
    } else if (data.directMessageRoomMemberDTOList.length === 1) {
      history.push(
        `/Profile?username=${data.directMessageRoomMemberDTOList[0].username}`
      );
    }
  };

  const onChatProfileClick = (data) => {
    history.push(`/Profile?username=${data.username}`);
  };

  const onShareProfileClick = (data) => {
    history.push(`/Profile?username=${data.contentUsername}`);
  };

  return (
    <>
      <div className="chat-right">
        <div className="chat-friend">
          <div className="chat-friend__user">
            <img
              src={
                userInfo.directMessageRoomMemberDTOList[0].profileImgName ===
                null
                  ? profileDefaultImg
                  : profileFilePath +
                    userInfo.directMessageRoomMemberDTOList[0].profileImgName
              }
              alt=""
              onClick={() => onProfileClick(userInfo)}
            />
            <h5 onClick={() => onProfileClick(userInfo)}>
              {userInfo.directMessageRoomMemberDTOList.length === 2
                ? userInfo.directMessageRoomMemberDTOList[1].nickname
                : userInfo.directMessageRoomMemberDTOList[0].nickname}
            </h5>
          </div>
          <div className="chat-info-btn">
            <p>
              <MdExitToApp onClick={onChatExitModalHandler} />
            </p>
          </div>
        </div>
        <div className="chatting-area" ref={scrollRef}>
          <div className="fixed"></div>
          {chatList
            .slice(0)
            .reverse()
            .map((data, idx) => {
              // 채팅 처음 받아온 리스트 렌더링하는 부분
              if (data.username === localUserName) {
                // 로컬유저 채팅 부분 -> 채팅화면 기준 오른쪽
                if (data.directMessageType === "text") {
                  // 텍스트 처리
                  return (
                    <div className="my-message" key={idx}>
                      <p>{data.directMessage}</p>
                    </div>
                  );
                } else if (data.directMessageType === "file") {
                  // 사진 처리
                  return (
                    <div className="my-message" key={idx}>
                      <div className="img-message">
                        <img src={dmFilePath + data.directMessage} />
                      </div>
                    </div>
                  );
                } else if (data.directMessageType === "share") {
                  // 공유 처리
                  const jsonData = JSON.parse(data.directMessage);
                  if (jsonData.contentFileDTOList[0].type === "video/mp4") {
                    return (
                      <div className="my-message2" key={idx}>
                        <div className="my-message__share">
                          <div className="share-user">
                            <img
                              src={
                                jsonData.profileImgName === null
                                  ? profileDefaultImg
                                  : profileFilePath + jsonData.profileImgName
                              }
                              alt=""
                              onClick={() => onShareProfileClick(jsonData)}
                            />
                            <h4 onClick={() => onShareProfileClick(jsonData)}>
                              {jsonData.nickname}
                            </h4>
                          </div>
                          <div
                            className="share-contents"
                            onClick={() =>
                              onCommentModalHandler(data, jsonData)
                            }
                          >
                            <video controls height="200">
                              <source
                                src={contentFilePath + jsonData.thumbnail}
                                type="video/mp4"
                              />
                            </video>
                          </div>
                          <div className="share-post">
                            <h4>{jsonData.nickname}</h4>
                            <p>{jsonData.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (
                    jsonData.contentFileDTOList[0].type === "image/jpeg" ||
                    jsonData.contentFileDTOList[0].type === "image/png"
                  ) {
                    return (
                      <div className="my-message2" key={idx}>
                        <div className="my-message__share">
                          <div className="share-user">
                            <img
                              src={
                                jsonData.profileImgName === null
                                  ? profileDefaultImg
                                  : profileFilePath + jsonData.profileImgName
                              }
                              alt=""
                              onClick={() => onShareProfileClick(jsonData)}
                            />
                            <h4 onClick={() => onShareProfileClick(jsonData)}>
                              {jsonData.nickname}
                            </h4>
                          </div>
                          <div
                            className="share-contents"
                            onClick={() =>
                              onCommentModalHandler(data, jsonData)
                            }
                          >
                            <img
                              src={contentFilePath + jsonData.thumbnail}
                              alt=""
                            />
                          </div>
                          <div className="share-post">
                            <h4>{jsonData.nickname}</h4>
                            <p>{jsonData.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
              } else {
                // 채팅하고 있는 상대 부분 -> 채팅화면 기준 왼쪽
                if (data.directMessageType === "text") {
                  return (
                    <div className="friend-message" key={idx}>
                      <img
                        className="friend-message-profile-img"
                        src={
                          userInfo.directMessageRoomMemberDTOList[0]
                            .profileImgName === null
                            ? profileDefaultImg
                            : profileFilePath +
                              userInfo.directMessageRoomMemberDTOList[0]
                                .profileImgName
                        }
                        alt=""
                        onClick={() => onChatProfileClick(data)}
                      />
                      <p>{data.directMessage}</p>
                    </div>
                  );
                } else if (data.directMessageType === "file") {
                  return (
                    <div className="friend-message" key={idx}>
                      <img
                        className="friend-message-profile-img"
                        src={
                          userInfo.directMessageRoomMemberDTOList[0]
                            .profileImgName === null
                            ? profileDefaultImg
                            : profileFilePath +
                              userInfo.directMessageRoomMemberDTOList[0]
                                .profileImgName
                        }
                        alt=""
                        onClick={() => onChatProfileClick(data)}
                      />
                      <div className="img-message">
                        <img src={dmFilePath + data.directMessage} />
                      </div>
                    </div>
                  );
                } else if (data.directMessageType === "share") {
                  const jsonData = JSON.parse(data.directMessage);
                  if (jsonData.contentFileDTOList[0].type === "video/mp4") {
                    return (
                      <div className="friend-message2" key={idx}>
                        <img
                          className="friend-message__img"
                          src={
                            userInfo.directMessageRoomMemberDTOList[0]
                              .profileImgName === null
                              ? profileDefaultImg
                              : profileFilePath +
                                userInfo.directMessageRoomMemberDTOList[0]
                                  .profileImgName
                          }
                          alt=""
                          onClick={() => onChatProfileClick(data)}
                        />
                        <div className="friend-message__share">
                          <div className="share-user">
                            <img
                              src={
                                jsonData.profileImgName === null
                                  ? profileDefaultImg
                                  : profileFilePath + jsonData.profileImgName
                              }
                              alt=""
                              onClick={() => onShareProfileClick(jsonData)}
                            />
                            <h4 onClick={() => onShareProfileClick(jsonData)}>
                              {jsonData.nickname}
                            </h4>
                          </div>
                          <div
                            className="share-contents"
                            onClick={() =>
                              onCommentModalHandler(data, jsonData)
                            }
                          >
                            <video controls height="200">
                              <source
                                src={contentFilePath + jsonData.thumbnail}
                                type="video/mp4"
                              />
                            </video>
                          </div>
                          <div className="share-post">
                            <h4>{jsonData.nickname}</h4>
                            <p>{jsonData.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (
                    jsonData.contentFileDTOList[0].type === "image/jpeg" ||
                    jsonData.contentFileDTOList[0].type === "image/png"
                  ) {
                    return (
                      <div className="friend-message2" key={idx}>
                        <img
                          className="friend-message__img"
                          src={
                            userInfo.directMessageRoomMemberDTOList[0]
                              .profileImgName === null
                              ? profileDefaultImg
                              : profileFilePath +
                                userInfo.directMessageRoomMemberDTOList[0]
                                  .profileImgName
                          }
                          alt=""
                          onClick={() => onChatProfileClick(data)}
                        />
                        <div className="friend-message__share">
                          <div className="share-user">
                            <img
                              src={
                                jsonData.profileImgName === null
                                  ? profileDefaultImg
                                  : profileFilePath + jsonData.profileImgName
                              }
                              alt=""
                              onClick={() => onShareProfileClick(jsonData)}
                            />
                            <h4 onClick={() => onShareProfileClick(jsonData)}>
                              {jsonData.nickname}
                            </h4>
                          </div>
                          <div
                            className="share-contents"
                            onClick={() =>
                              onCommentModalHandler(data, jsonData)
                            }
                          >
                            <img
                              src={contentFilePath + jsonData.thumbnail}
                              alt=""
                            />
                          </div>
                          <div className="share-post">
                            <h4>{jsonData.nickname}</h4>
                            <p>{jsonData.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
              }
            })}
          {myChatBox.map((data, idx) => {
            // 채팅 보내고 실시간으로 렌더링 하는 부분
            if (data.username === localUserName) {
              // 로컬유저 채팅 부분 -> 채팅화면 기준 오른쪽
              if (data.type === "text") {
                return (
                  <div className="my-message" key={idx}>
                    <p>{data.msg}</p>
                  </div>
                );
              } else if (data.type === "file") {
                return (
                  <div className="my-message" key={idx}>
                    <div className="img-message">
                      <img src={data.msg} />
                    </div>
                  </div>
                );
              } else if (data.type === "share") {
                if (data.contentFileDTOList[0].type === "video/mp4") {
                  return (
                    <div className="my-message2" key={idx}>
                      <div className="my-message__share">
                        <div className="share-user">
                          <img
                            src={
                              data.profileImgName === null
                                ? profileDefaultImg
                                : profileFilePath + data.profileImgName
                            }
                            alt=""
                            onClick={() => onShareProfileClick(data)}
                          />
                          <h4 onClick={() => onShareProfileClick(data)}>
                            {data.nickname}
                          </h4>
                        </div>
                        <div
                          className="share-contents"
                          onClick={() => onWebSocketCommentModalHandler(data)}
                        >
                          <video controls height="200">
                            <source
                              src={contentFilePath + data.thumbnail}
                              type="video/mp4"
                            />
                          </video>
                        </div>
                        <div className="share-post">
                          <h4>{data.nickname}</h4>
                          <p>{data.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                } else if (
                  data.contentFileDTOList[0].type === "image/jpeg" ||
                  data.contentFileDTOList[0].type === "image/png"
                ) {
                  return (
                    <div className="my-message2" key={idx}>
                      <div className="my-message__share">
                        <div className="share-user">
                          <img
                            src={
                              data.profileImgName === null
                                ? profileDefaultImg
                                : profileFilePath + data.profileImgName
                            }
                            alt=""
                            onClick={() => onShareProfileClick(data)}
                          />
                          <h4 onClick={() => onShareProfileClick(data)}>
                            {data.nickname}
                          </h4>
                        </div>
                        <div
                          className="share-contents"
                          onClick={() => onWebSocketCommentModalHandler(data)}
                        >
                          <img src={contentFilePath + data.thumbnail} alt="" />
                        </div>
                        <div className="share-post">
                          <h4>{data.nickname}</h4>
                          <p>{data.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              }
            } else {
              if (data.type === "text") {
                return (
                  <div className="friend-message" key={idx}>
                    <img
                      className="friend-message-profile-img"
                      src={
                        userInfo.directMessageRoomMemberDTOList[0]
                          .profileImgName === null
                          ? profileDefaultImg
                          : profileFilePath +
                            userInfo.directMessageRoomMemberDTOList[0]
                              .profileImgName
                      }
                      alt=""
                    />
                    <p>{data.msg}</p>
                  </div>
                );
              } else if (data.type === "file") {
                return (
                  <div className="friend-message" key={idx}>
                    <img
                      className="friend-message-profile-img"
                      src={
                        userInfo.directMessageRoomMemberDTOList[0]
                          .profileImgName === null
                          ? profileDefaultImg
                          : profileFilePath +
                            userInfo.directMessageRoomMemberDTOList[0]
                              .profileImgName
                      }
                      alt=""
                      onClick={() => onChatProfileClick(data)}
                    />
                    <div className="img-message">
                      <img src={data.msg} />
                    </div>
                  </div>
                );
              } else if (data.type === "share") {
                if (data.contentFileDTOList[0].type === "video/mp4") {
                  return (
                    <div className="friend-message2" key={idx}>
                      <img
                        className="friend-message__img"
                        src={
                          userInfo.directMessageRoomMemberDTOList[0]
                            .profileImgName === null
                            ? profileDefaultImg
                            : profileFilePath +
                              userInfo.directMessageRoomMemberDTOList[0]
                                .profileImgName
                        }
                        alt=""
                        onClick={() => onChatProfileClick(data)}
                      />
                      <div className="friend-message__share">
                        <div className="share-user">
                          <img
                            src={
                              data.profileImgName === null
                                ? profileDefaultImg
                                : profileFilePath + data.profileImgName
                            }
                            alt=""
                            onClick={() => onShareProfileClick(data)}
                          />
                          <h4 onClick={() => onShareProfileClick(data)}>
                            {data.nickname}
                          </h4>
                        </div>
                        <div
                          className="share-contents"
                          onClick={() => onWebSocketCommentModalHandler(data)}
                        >
                          <video controls height="200">
                            <source
                              src={contentFilePath + data.thumbnail}
                              type="video/mp4"
                            />
                          </video>
                        </div>
                        <div className="share-post">
                          <h4>{data.nickname}</h4>
                          <p>{data.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                } else if (
                  data.contentFileDTOList[0].type === "image/jpeg" ||
                  data.contentFileDTOList[0].type === "image/png"
                ) {
                  return (
                    <div className="friend-message2" key={idx}>
                      <img
                        className="friend-message__img"
                        src={
                          userInfo.directMessageRoomMemberDTOList[0]
                            .profileImgName === null
                            ? profileDefaultImg
                            : profileFilePath +
                              userInfo.directMessageRoomMemberDTOList[0]
                                .profileImgName
                        }
                        alt=""
                        onClick={() => onChatProfileClick(data)}
                      />
                      <div className="friend-message__share">
                        <div className="share-user">
                          <img
                            src={
                              data.profileImgName === null
                                ? profileDefaultImg
                                : profileFilePath + data.profileImgName
                            }
                            alt=""
                            onClick={() => onShareProfileClick(data)}
                          />
                          <h4 onClick={() => onShareProfileClick(data)}>
                            {data.nickname}
                          </h4>
                        </div>
                        <div
                          className="share-contents"
                          onClick={() => onWebSocketCommentModalHandler(data)}
                        >
                          <img src={contentFilePath + data.thumbnail} alt="" />
                        </div>
                        <div className="share-post">
                          <h4>{data.nickname}</h4>
                          <p>{data.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              }
            }
          })}
        </div>

        <div className="input-message">
          <input
            type="text"
            placeholder="메세지 입력..."
            value={inputText}
            onChange={onInputTextHandler}
            onKeyPress={onKeyPress}
          />
          <div className="input-image">
            <input
              type="file"
              id="getfile"
              accept="image/*, video/*"
              multiple
              onChange={onImageHandler}
            />
            <label htmlFor="getfile">
              <FaRegImage />
            </label>
          </div>
        </div>
      </div>
      <Modal isOpen={chatExitModalOn} setIsOpen={setChatExitModalOn}>
        <ChatExitModal
          setChatExitModalOn={setChatExitModalOn}
          paramsId={paramsId}
        />
      </Modal>
      <Modal isOpen={commentModalOn} setIsOpen={setCommentModalOn}>
        <CommentModal
          commentData={commentData}
          setCommentModalOn={setCommentModalOn}
          items={items}
          setItems={setItems}
          getRegdate={getRegdate}
          settings={settings}
          time={time}
        />
      </Modal>
    </>
  );
};

export default ChatRoom;
