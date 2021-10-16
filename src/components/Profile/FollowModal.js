import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisH, FaTimes } from "react-icons/fa";
import profileDefaultImg from "../../../public/images/default_user.png";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import * as fnc from "../../commonFunc/CommonFunctions";

let page = 0;

const FollowModal = (props) => {
  const { localUser, paramsId, setSubscribeModalOn } = props;
  const [list, setList] = useState([]);
  const scrollRef = useRef(null);

  // 팔로우 리스트 data 불러오기
  const getFollowData = (user, other) => {
    fncObj.executeQuery({
      url: "follow/getPagingList",
      data: {
        username: user,
        target: other,
        page: 0,
        size: 6,
      },
      success: (res) => {
        setList(res.content);
      },
    });
  };

  // 스크롤 했을 때 데이터 더 가져오기
  const getAddFollowData = (user, other, page) => {
    fncObj.executeQuery({
      url: "follow/getPagingList",
      data: {
        page: page,
        size: 6,
        username: user,
        target: other,
      },
      success: (res) => {
        if (res.content.length > 0) setList(list.concat(res.content));
      },
    });
  };

  // 팔로우 추가 및 삭제
  const sendFollowYnData = (data, idx) => {
    fnc.executeQuery({
      url: "follow/save",
      data: {
        username: localUser,
        target: data,
      },
      success: (res) => {
        const newList = [...list];
        newList[idx].followYn = res.followYn;
        setList(newList);
      },
    });
  };

  // 맞팔 & 언팔 & 팔로우 버튼 클릭 시
  const followBtnClick = (data, idx) => {
    sendFollowYnData(data.follow, idx);
  };
  // 모달창 나가기 버튼 클릭 시
  const onExitBtnClick = () => {
    setSubscribeModalOn(false);
  };

  useEffect(() => {
    if (localUser === paramsId) {
      getFollowData(localUser, localUser);
    } else {
      getFollowData(localUser, paramsId);
    }
  }, []);

  // 스크롤 감지
  const handleScroll = () => {
    console.log("scroll");
    const scrollHeight = scrollRef.current.scrollHeight;
    const scrollTop = scrollRef.current.scrollTop;
    const clientHeight = scrollRef.current.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      ++page;
      getAddSubscribeData(page);
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

  return (
    <div className="subs-window">
      <div className="subs-area">
        <div className="subs__top">
          <h6></h6>
          <h4>팔로우</h4>
          <p>
            <FaTimes onClick={onExitBtnClick} />
          </p>
        </div>
        <div className="subs__bottom">
          <div className="subs-list-area" ref={scrollRef}>
            {list.map((data, idx) => {
              if (localUser === paramsId) {
                return (
                  <div className="subs-list" key={idx}>
                    <div className="subs-user">
                      <img
                        src={
                          data.profileImgName === null
                            ? profileDefaultImg
                            : `upload/profile/${data.profileImgName}`
                        }
                        alt=""
                      />
                      <h4>{data.nickname}</h4>
                      <h5>{data.name}</h5>
                    </div>
                    <div className="subs-cancle">
                      {data.followYn === "N" && data.followerYn === "Y" ? (
                        <button onClick={() => followBtnClick(data, idx)}>
                          맞팔로우
                        </button>
                      ) : (data.followYn === "Y" && data.followerYn === "Y") ||
                        (data.followYn === "Y" && data.followerYn === "N") ? (
                        <button onClick={() => followBtnClick(data, idx)}>
                          언팔로우
                        </button>
                      ) : (
                        <button onClick={() => followBtnClick(data, idx)}>
                          팔로우
                        </button>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="subs-list" key={idx}>
                    <div className="subs-user">
                      <img
                        src={
                          data.profileImgName === null
                            ? profileDefaultImg
                            : `upload/profile/${data.profileImgName}`
                        }
                        alt=""
                      />
                      <h4>{data.nickname}</h4>
                      <h5>{data.name}</h5>
                    </div>
                    <div className="subs-cancle">
                      {localUser === data.follow ? (
                        ""
                      ) : data.followYn === "N" && data.followerYn === "Y" ? (
                        <button onClick={() => followBtnClick(data, idx)}>
                          맞팔로우
                        </button>
                      ) : (data.followYn === "Y" && data.followerYn === "Y") ||
                        (data.followYn === "Y" && data.followerYn === "N") ? (
                        <button onClick={() => followBtnClick(data, idx)}>
                          언팔로우
                        </button>
                      ) : (
                        <button onClick={() => followBtnClick(data, idx)}>
                          팔로우
                        </button>
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
