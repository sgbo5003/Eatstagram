import React, { useEffect, useRef, useState } from "react";
import { FaImage, FaRegImage, FaHeart, FaRegHeart } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import storyProfileImg1 from "../../public/images/명수스토리.jpg";
import * as fncObj from "../commonFunc/CommonObjFunctions";
import Header from "./Header";
import Chat from "./Chat";
import { useHistory } from "react-router";

let page = 0;

const ChatRoom = (props) => {
  const { paramsId } = props;
  const history = useHistory();
  const localUserName = localStorage.getItem("username");
  const webSocketUrl = `ws://www.whereyedo.com:8080/ws/directMessage/${paramsId}`;
  let ws = useRef(null);
  const scrollRef = useRef(null);
  const [inputText, setInputText] = useState(""); // input 부분
  const [myChatBox, setMyChatBox] = useState([]); // 나의 메세지를 담는 배열
  const [friendChatBox, setFriendChatBox] = useState([]); // 상대 메세지를 담는 배열
  const [chatList, setChatList] = useState([]); // 받아온 채팅 리스트
  const [initialScroll, setInitialScroll] = useState(false); // 처음 스크롤 제어
  const [isDone, setIsDone] = useState(false); // 스크롤해서 데이터 가져오고 난뒤 체크
  const [image, setImage] = useState(null); // 이미지 파일

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
      console.log(imageFile);
    }
  };
  // 채팅 입력
  const onInputTextHandler = (e) => {
    setInputText(e.target.value);
  };

  // 채팅 입력 (Enter키)
  const onKeyPress = (e) => {
    if (e.key == "Enter") {
      if (inputText === "") {
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
    }
  };

  useEffect(() => {
    ws.current = new WebSocket(webSocketUrl);
    ws.current.onopen = () => {
      console.log("connected to " + webSocketUrl);
      getChatData();
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
        setInitialScroll(true);
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
    scrollRef.current.scrollTo({ top: scrollHeight, behavior: "smooth" });
  };

  // 처음 스크롤 젤 하단으로 내리기
  const initialScrollPosition = () => {
    scrollRef.current.scrollTop = 194;
  };

  useEffect(() => {
    if (!initialScroll) {
      initialScrollPosition();
    } else {
      return;
    }
  });

  return (
    <>
      <Header />
      <div className="chat-right">
        <div className="chat-friend">
          <div className="chat-friend__user">
            <img src={storyProfileImg1} alt="" />
            <h5>whereyedo</h5>
          </div>
          <div className="chat-info-btn">
            <p>
              <BsInfoCircle />
            </p>
          </div>
        </div>
        <div className="chatting-area" ref={scrollRef}>
          <h4>2021년 9월 17일</h4>
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
                      <img
                        src={`public/upload/dm/${data.directMessage}`}
                        style={{ width: "60px", height: "60px" }}
                      />
                    </div>
                  );
                }
              } else {
                if (data.directMessageType === "text") {
                  return (
                    <div className="friend-message" key={idx}>
                      <img src={storyProfileImg1} alt="" />
                      <p>{data.directMessage}</p>
                    </div>
                  );
                } else if (data.directMessageType === "file") {
                  return (
                    <div className="friend-message" key={idx}>
                      <img
                        src={`public/upload/dm/${data.directMessage}`}
                        style={{ width: "60px", height: "60px" }}
                      />
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
                    <img
                      src={`public/upload/dm/${data.msg}`}
                      style={{ width: "60px", height: "60px" }}
                    />
                  </div>
                );
              }
            } else {
              if (data.directMessageType === "text") {
                return (
                  <div className="friend-message" key={idx}>
                    <img src={storyProfileImg1} alt="" />
                    <p>{data.directMessage}</p>
                  </div>
                );
              } else if (data.directMessageType === "file") {
                return (
                  <div className="friend-message" key={idx}>
                    <img
                      src={`public/upload/dm/${data.directMessage}`}
                      style={{ width: "60px", height: "60px" }}
                    />
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
            <FaRegHeart />
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
