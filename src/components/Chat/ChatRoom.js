import React, { useEffect, useRef, useState } from "react";
import { FaImage, FaRegImage, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdExitToApp } from "react-icons/md";
import storyProfileImg1 from "../../../public/images/명수스토리.jpg";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import Header from "../Header";
import Chat from "./Chat";
import { useHistory } from "react-router";
import Modal from "../../Modal";
import ChatExitModal from "./ChatExitModal";

let page = 0;

const ChatRoom = (props) => {
  const { paramsId, setUpdateChatList, updateChatList } = props;
  const history = useHistory();
  const localUserName = localStorage.getItem("username");
  // const webSocketUrl = `ws://www.whereyedo.com:55808/eatstagram/ws/directMessage/${paramsId}`;
  const webSocketUrl = `ws://localhost:8080/eatstagram/ws/directMessage/${paramsId}?username=${localUserName}`;
  let ws = useRef(null);
  const scrollRef = useRef(null);
  const [inputText, setInputText] = useState(""); // input 부분
  const [myChatBox, setMyChatBox] = useState([]); // 나의 메세지를 담는 배열
  const [friendChatBox, setFriendChatBox] = useState([]); // 상대 메세지를 담는 배열
  const [chatList, setChatList] = useState([]); // 받아온 채팅 리스트
  const [isDone, setIsDone] = useState(false); // 스크롤해서 데이터 가져오고 난뒤 체크
  const [image, setImage] = useState(null); // 이미지 파일
  const [chatExitModalOn, setChatExitModalOn] = useState(false);

  let uploadFileUsername;
  let uploadFileName;

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
      const data = JSON.parse(evt.data);
      if (updateChatList === false) {
        setUpdateChatList(true);
      }
      setMyChatBox((prevItems) => [...prevItems, data]);
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
        size: 16,
        directMessageRoomId: paramsId,
      },
      success: (res) => {
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
      scrollRef.current.removeEventListener("scroll", handleScroll);
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
    scrollRef.current.scrollTop = 194;
  };

  // 채팅방 나가기 모달 띄우기
  const onChatExitModalHandler = () => {
    setChatExitModalOn(true);
  };

  return (
    <>
      <div className="chat-right">
        <div className="chat-friend">
          <div className="chat-friend__user">
            <img src={storyProfileImg1} alt="" />
            <h5>whereyedo</h5>
          </div>
          <div className="chat-info-btn">
            <p>
              <MdExitToApp onClick={onChatExitModalHandler} />
            </p>
          </div>
        </div>
        <div className="chatting-area" ref={scrollRef}>
          <div className="fixed"></div>
          {/* <h4>2021년 9월 17일</h4> */}
          {chatList
            .slice(0)
            .reverse()
            .map((data, idx) => {
              if (data.username === localUserName) {
                if (data.directMessageType === "text") {
                  return (
                    <div className="my-message" key={idx}>
                      <p>{data.directMessage}</p>
                    </div>
                  );
                } else if (data.directMessageType === "file") {
                  return (
                    <div className="my-message" key={idx}>
                      <div className="img-message">
                        {/*<img src={`public/upload/dm/${data.directMessage}`} />*/}
                        <img src={`upload/dm/${data.directMessage}`} />
                      </div>
                    </div>
                  );
                } else if (data.directMessageType === "share") {
                  const jsonData = JSON.parse(data.directMessage);
                  return (
                    <div className="my-message2" key={idx}>
                      <div className="my-message__share">
                        <div className="share-user">
                          <img src="./images/묭수.jpg" alt="" />
                          <h4>{jsonData.username}</h4>
                        </div>
                        <div className="share-contents">
                          <img
                            src={`upload/content/${jsonData.thumbnail}`}
                            alt=""
                          />
                        </div>
                        <div className="share-post">
                          <h4>{jsonData.username}</h4>
                          <p>{jsonData.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              } else {
                if (data.directMessageType === "text") {
                  return (
                    <div className="friend-message" key={idx}>
                      <img
                        className="friend-message-profile-img"
                        src={storyProfileImg1}
                        alt=""
                      />
                      <p>{data.directMessage}</p>
                    </div>
                  );
                } else if (data.directMessageType === "file") {
                  return (
                    <div className="friend-message" key={idx}>
                      <div className="img-message">
                        {/*<img src={`public/upload/dm/${data.directMessage}`} />*/}
                        <img src={`upload/dm/${data.directMessage}`} />
                      </div>
                    </div>
                  );
                } else if (data.directMessageType === "share") {
                  const jsonData = JSON.parse(data.directMessage);
                  return (
                    <div className="friend-message2" key={idx}>
                      <img
                        className="friend-message__img"
                        src="./images/명수스토리.jpg"
                        alt=""
                      />
                      <div className="friend-message__share">
                        <div className="share-user">
                          <img src="./images/묭수.jpg" alt="" />
                          <h4>{jsonData.username}</h4>
                        </div>
                        <div className="share-contents">
                          <img
                            src={`upload/content/${jsonData.thumbnail}`}
                            alt=""
                          />
                        </div>
                        <div className="share-post">
                          <h4>{jsonData.username}</h4>
                          <p>{jsonData.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              }
            })}
          {myChatBox.map((data, idx) => {
            if (data.username === localUserName) {
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
                      {/* <img src={`public/upload/dm/${data.msg}`} /> */}
                      <img src={`upload/dm/${data.msg}`} />
                    </div>
                  </div>
                );
              } else if (data.type === "share") {
                return (
                  <div className="my-message2" key={idx}>
                    <div className="my-message__share">
                      <div className="share-user">
                        <img src="./images/묭수.jpg" alt="" />
                        <h4>{jsonData.username}</h4>
                      </div>
                      <div className="share-contents">
                        <img
                          src={`upload/content/${jsonData.thumbnail}`}
                          alt=""
                        />
                      </div>
                      <div className="share-post">
                        <h4>{jsonData.username}</h4>
                        <p>{jsonData.text}</p>
                      </div>
                    </div>
                  </div>
                );
              }
            } else {
              if (data.type === "text") {
                return (
                  <div className="friend-message" key={idx}>
                    <img
                      className="friend-message-profile-img"
                      src={storyProfileImg1}
                      alt=""
                    />
                    <p>{data.msg}</p>
                  </div>
                );
              } else if (data.type === "file") {
                return (
                  <div className="friend-message" key={idx}>
                    <div className="img-message">
                      {/* <img src={`public/upload/dm/${data.directMessage}`} /> */}
                      <img src={`upload/dm/${data.msg}`} />
                    </div>
                  </div>
                );
              } else if (data.type === "share") {
                return (
                  <div className="friend-message2" key={idx}>
                    <img
                      className="friend-message__img"
                      src="./images/명수스토리.jpg"
                      alt=""
                    />
                    <div className="friend-message__share">
                      <div className="share-user">
                        <img src="./images/묭수.jpg" alt="" />
                        <h4>{data.username}</h4>
                      </div>
                      <div className="share-contents">
                        <img src={`upload/content/${data.thumbnail}`} alt="" />
                      </div>
                      <div className="share-post">
                        <h4>{data.username}</h4>
                        <p>{data.text}</p>
                      </div>
                    </div>
                  </div>
                );
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
          <p>
            <FaRegHeart
              onClick={() => {
                ws.current.send(
                  JSON.stringify({
                    msg: inputText,
                    type: "text",
                    roomType: "directMessage",
                    roomId: paramsId,
                    username: localUserName,
                  })
                );
              }}
            />
          </p>
        </div>
      </div>
      <Modal isOpen={chatExitModalOn} setIsOpen={setChatExitModalOn}>
        <ChatExitModal
          setChatExitModalOn={setChatExitModalOn}
          paramsId={paramsId}
        />
      </Modal>
    </>
  );
};

export default ChatRoom;
