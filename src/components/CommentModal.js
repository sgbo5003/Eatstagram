import React, { useEffect, useRef, useState } from "react";
import foodImg from "../images/food.jpg";
import userImg from "../images/묭수.jpg";
import userImg2 from "../images/명수스토리.jpg";
import { FaEllipsisH, FaTimes, FaPlusCircle } from "react-icons/fa";
import * as fncObj from "../commonFunc/CommonObjFunctions";

const CommentModal = (props) => {
  const [comment, setComment] = useState(""); // 댓글
  const [commentBox, setCommentBox] = useState([]); // 댓글 보여지는 부분
  const [items, setItems] = useState([]);
  const { commentData } = props;

  const webSocketUrl = `ws://localhost:8080/ws/contentReply/${commentData.contentId}`;
  let ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(webSocketUrl);
    ws.current.onopen = () => {
      console.log("connected to " + webSocketUrl);
      getData();
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
      items.push(data);
      items.forEach((item) => {
        getRegdate(item);
      });
      setItems([...items]);
    };
    return () => {
      console.log("clean up");
      ws.current.close();
    };
  }, []);

  // 댓글 입력
  const onCommentInputHandler = (e) => {
    setComment(e.target.value);
  };

  // 댓글 전송
  const onSendMessageHandler = () => {
    if (comment === "") {
      return;
    } else {
      ws.current.send(
        JSON.stringify({
          roomId: commentData.contentId,
          username: commentData.username,
          msg: comment,
        })
      );
      updateCommentBox();
    }
    // 채팅을 보내면 input 비워주기
    setComment("");
  };

  // 댓글창 업데이트
  const updateCommentBox = () => {
    commentBox.map((data) => {
      getRegdate(data);
    });
    setCommentBox([...commentBox]);
  };

  // 채팅들 가져오기
  const getData = () => {
    fncObj.executeQuery({
      url: "content/reply/getPagingList",
      data: {
        page: 0,
        size: 6,
        contentId: commentData.contentId,
      },
      success: (res) => {
        res.content.map((item, idx) => {
          getRegdate(item);
        });
        setCommentBox(res.content);
      },
    });
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
                    <h1>{commentData.username}</h1>
                  </div>
                  <div className="post-window-map">
                    <h2>{commentData.location}</h2>
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
                  <img src={foodImg} alt="" />
                </div>
                <div className="comment-user__id">
                  <h1>{commentData.username}</h1>
                </div>
                <div className="comment-user__text">
                  <p>{commentData.text}</p>
                </div>
              </div>
              {items
                .slice(0)
                .reverse()
                .map((data, idx) => {
                  return (
                    <div className="comment" key={idx}>
                      <div className="comment-user__img">
                        <img src={userImg2} alt="" />
                      </div>
                      <div className="comment-user__id">
                        <h1>{data.username}</h1>
                      </div>
                      <div className="comment-user__text">
                        <p>{data.msg}</p>
                      </div>
                      <div className="comment-user__text">
                        <p>{data.time}</p>
                      </div>
                    </div>
                  );
                })}
              {commentBox.map((data, idx) => {
                return (
                  <div className="comment" key={idx}>
                    <div className="comment-user__img">
                      <img src={userImg2} alt="" />
                    </div>
                    <div className="comment-user__id">
                      <h1>{data.username}</h1>
                    </div>
                    <div className="comment-user__text">
                      <p>{data.reply}</p>
                    </div>
                    <div className="comment-user__text">
                      <p>{data.time}</p>
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
                <button type="button" onClick={onSendMessageHandler}>
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
