import React, { useEffect, useRef, useState } from "react";
import foodImg from "../../../public/images/food.jpg";
import userImg from "../../../public/images/묭수.jpg";
import userImg2 from "../../../public/images/명수스토리.jpg";
import profileDefaultImg from "../../../public/images/default_user.png";
import { FaEllipsisH, FaTimes } from "react-icons/fa";
import { AiOutlinePlusCircle } from "react-icons/ai";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import Slider from "react-slick";

const CommentModal = (props) => {
  const [comment, setComment] = useState(""); // 댓글
  const [commentBox, setCommentBox] = useState([]); // 댓글 보여지는 부분
  const [count, setCount] = useState(1);
  const [button, setButton] = useState(false);
  const localUserName = localStorage.getItem("username");
  const localUserNickName = localStorage.getItem("userNickname");
  const {
    commentData,
    setCommentModalOn,
    items,
    setItems,
    getRegdate,
    settings,
    onProfileClick,
  } = props;

  //   const webSocketUrl = `ws://www.whereyedo.com:55808/eatstagram/ws/contentReply/${commentData.contentId}`;
  const webSocketUrl = `ws://localhost:8080/eatstagram/ws/contentReply/${commentData.contentId}`;
  let ws = useRef(null);

  useEffect(() => {
    console.log("commentData", commentData);
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
      setItems([]);
    };
  }, []);

  // 댓글 입력
  const onCommentInputHandler = (e) => {
    setComment(e.target.value);
  };

  // 댓글 전송
  const onSendMessageHandler = () => {
    if (comment === "" || comment.trim() === "") {
      return;
    } else {
      ws.current.send(
        JSON.stringify({
          roomId: commentData.contentId,
          username: localUserName,
          nickname: localUserNickName,
          msg: comment,
          type: "text",
          roomType: "contentReply",
        })
      );
      updateCommentBox();
    }
    // 댓글을 보내면 input 비워주기
    setComment("");
  };

  // 엔터키 눌러 댓글 전송
  const onKeyPress = (e) => {
    if (e.key == "Enter") {
      if (comment === "" || comment.trim() === "") {
        return;
      } else {
        ws.current.send(
          JSON.stringify({
            roomId: commentData.contentId,
            username: localUserName,
            nickname: localUserNickName,
            msg: comment,
            type: "text",
            roomType: "contentReply",
          })
        );
        updateCommentBox();
      }
      // 댓글을 보내면 input 비워주기
      setComment("");
    }
  };

  // 댓글창 업데이트
  const updateCommentBox = () => {
    commentBox.map((data) => {
      getRegdate(data);
    });
    setCommentBox([...commentBox]);
  };

  // 댓글들 가져오기
  const getData = () => {
    fncObj.executeQuery({
      url: "content/reply/getPagingList",
      data: {
        page: 0,
        size: 6,
        contentId: commentData.contentId,
      },
      success: (res) => {
        if (res.content.length >= 6) {
          setButton(true);
        } else {
          setButton(false);
        }
        res.content.map((item, idx) => {
          getRegdate(item);
        });
        setCommentBox(res.content);
      },
    });
  };

  // 댓글들 추가로 가져오기
  const getAddData = () => {
    setCount((prevNum) => prevNum + 1);
    fncObj.executeQuery({
      url: "content/reply/getPagingList",
      data: {
        page: count,
        size: 6,
        contentId: commentData.contentId,
      },
      success: (res) => {
        if (res.content.length >= 6) {
          setButton(true);
        } else {
          setButton(false);
        }
        res.content.map((item, idx) => {
          getRegdate(item);
        });
        setCommentBox(commentBox.concat(res.content));
      },
    });
  };

  const onExitModalHandler = () => {
    setCommentModalOn(false);
  };
  return (
    <>
      <div className="post-window">
        <div className="post-window-area">
          <div className="post-window-left">
            <div className="post-window-contents">
              <Slider {...settings}>
                {commentData.contentFileDTOList.map((data, idx) => {
                  if (data.type === "image/png" || data.type === "image/jpeg") {
                    return (
                      <img
                        //   src={`public/upload/content/${data.name}`}
                        src={`upload/content/${data.name}`}
                        alt=""
                        key={idx}
                      />
                    );
                  } else if (data.type === "video/mp4") {
                    return (
                      <video controls height="600" key={idx}>
                        <source
                          // src={`public/upload/content/${data.name}`}
                          src={`upload/content/${data.name}`}
                          type="video/mp4"
                        />
                      </video>
                    );
                  }
                })}
              </Slider>
            </div>
          </div>
          <div className="post-window-right">
            <div className="post-window-top">
              <div className="post-window-user">
                <div className="post-window-user__img">
                  <img
                    src={
                      commentData.profileImgName === null
                        ? profileDefaultImg
                        : `upload/profile/${commentData.profileImgName}`
                    }
                    alt=""
                    onClick={() => onProfileClick(commentData)}
                  />
                </div>
                <div>
                  <div className="post-window-user__id">
                    <h1 onClick={() => onProfileClick(commentData)}>
                      {commentData.nickname}
                    </h1>
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
                  <img
                    src={
                      commentData.profileImgName === null
                        ? profileDefaultImg
                        : `upload/profile/${commentData.profileImgName}`
                    }
                    alt=""
                    onClick={() => onProfileClick(commentData)}
                  />
                </div>
                <div className="comment-user__id">
                  <h1 onClick={() => onProfileClick(commentData)}>
                    {commentData.nickname}
                  </h1>
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
                        <img
                          src={
                            data.profileImgName === null
                              ? profileDefaultImg
                              : `upload/profile/${data.profileImgName}`
                          }
                          alt=""
                          onClick={() => onProfileClick(data)}
                        />
                      </div>
                      <div className="comment-user__id">
                        <h1 onClick={() => onProfileClick(data)}>
                          {data.nickname}
                        </h1>
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
                      <img
                        src={
                          data.profileImgName === null
                            ? profileDefaultImg
                            : `upload/profile/${data.profileImgName}`
                        }
                        alt=""
                        onClick={() => onProfileClick(data)}
                      />
                    </div>
                    <div className="comment-user__id">
                      <h1 onClick={() => onProfileClick(data)}>
                        {data.nickname}
                      </h1>
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
              {button ? (
                <div className="comment-over-btn">
                  <button onClick={getAddData}>
                    <AiOutlinePlusCircle />
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>

            <div className="post-window-bottom">
              <div className="post-window-comment-input">
                <input
                  type="text"
                  value={comment}
                  onChange={onCommentInputHandler}
                  onKeyPress={onKeyPress}
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
        <button onClick={onExitModalHandler}>
          <FaTimes />
        </button>
      </div>
    </>
  );
};

export default CommentModal;
