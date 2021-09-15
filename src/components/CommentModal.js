import React, { useEffect, useRef, useState } from "react";
import foodImg from "../images/food.jpg";
import userImg from "../images/묭수.jpg";
import userImg2 from "../images/명수스토리.jpg";
import { FaEllipsisH, FaTimes, FaPlusCircle } from "react-icons/fa";

const CommentModal = (props) => {
  const [comment, setComment] = useState(""); // 댓글
  const [commentBox, setCommentBox] = useState([]); // 댓글 보여지는 부분
  const [socketConnected, setSocketConnected] = useState(false);
  const { commentData } = props;

  const webSocketUrl = `ws://localhost:8080/ws/contentReply/${commentData.contentId}`;
  //let ws = useRef(null);

  useEffect(() => {
    let ws = new WebSocket(webSocketUrl);
    console.log(ws);
    ws.onopen = () => {
      console.log("connected to " + webSocketUrl);
      setSocketConnected(true);
      ws.send(
        JSON.stringify({
          message: "123123",
        })
      );
    };
    ws.onclose = (error) => {
      console.log("disconnect from " + webSocketUrl);
      console.log(error);
    };
    ws.onerror = (error) => {
      console.log("connection error " + webSocketUrl);
      console.log(error);
    };
    ws.onmessage = (evt) => {
      console.log("reaction");
      const data = JSON.parse(evt.data);
      console.log("data", data);
      //   setItems((prevItems) => [...prevItems, data]);
    };

    return () => {
      console.log("clean up");
      ws.close();
    };
  }, []);

  const onCommentInputHandler = (e) => {
    setComment(e.target.value);
  };

  // 댓글 작성
  const onSubmit = (e) => {
    console.log("clicked");
    // 값이 비었으면 리턴
    if (comment === "") {
      return;
    } else {
      // 값이 있으면 chatBox 배열에 inputText 추가
      setCommentBox(commentBox.concat(comment));
    }
    console.log(commentBox);
    // 채팅을 보내면 input 비워주기
    setComment("");
  };

  return (
    <>
      <div className="post-window">
        <div className="post-window-area">
          <div className="post-window-left">
            <div className="post-window-contents">
              <img src={foodImg} alt="" />
            </div>
          </div>

          <div className="post-window-right">
            <div className="post-window-top">
              <div className="post-window-user">
                <div className="post-window-user__img">
                  <img src={foodImg} alt="" />
                </div>
                <div>
                  <div className="post-window-user__id">
                    <h1>gyuxxr</h1>
                  </div>
                  <div className="post-window-map">
                    <h2>연하동</h2>
                  </div>
                </div>
              </div>
              <div className="post-window-setting">
                <p>
                  <FaEllipsisH />
                </p>
              </div>
            </div>

            <div className="post-window-comment">
              <div className="first-comment">
                <div className="comment-user__img">
                  <img src={userImg} alt="" />
                </div>
                <div className="comment-user__id">
                  <h1>gyuxxr</h1>
                </div>
                <div className="comment-user__text">
                  <p>오늘은 연하동에 갔다왔슴다 음~ 맛 좋다~ </p>
                </div>
              </div>
              {commentBox.map((data, idx) => {
                return (
                  <div className="comment" key={idx}>
                    <div className="comment-user__img">
                      <img src={userImg2} alt="" />
                    </div>
                    <div className="comment-user__id">
                      <h1>whereyedo</h1>
                    </div>
                    <div className="comment-user__text">
                      <p>{data}</p>
                    </div>
                  </div>
                );
              })}

              {/*댓글 넘칠 시 더보기 버튼*/}
              {/* <div className="comment-over-btn">
                <button>
                  <FaPlusCircle />
                </button>
              </div> */}
            </div>

            <div className="post-window-bottom">
              <div className="post-window-comment-input">
                <input
                  type="text"
                  value={comment}
                  onChange={onCommentInputHandler}
                  placeholder="댓글 달기..."
                />
                <button type="button" onClick={onSubmit}>
                  게시
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="window-close">
        <button>
          <FaTimes />
        </button>
      </div>
    </>
  );
};

export default CommentModal;
