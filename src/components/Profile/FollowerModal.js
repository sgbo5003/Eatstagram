import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisH, FaTimes } from "react-icons/fa";
import profileDefaultImg from "../../../public/images/default_user.png";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import * as fnc from "../../commonFunc/CommonFunctions";

let page = 0;

const FollowerModal = (props) => {
  const { localUser, paramsId, setFollowerModalOn } = props;
  const [list, setList] = useState([]);

  const scrollRef = useRef(null);

  // 팔로워 리스트 data 불러오기
  const getFollowerData = (user, other) => {
    fncObj.executeQuery({
      url: "follower/getPagingList",
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
  const getAddFollowerData = (user, other, page) => {
    fncObj.executeQuery({
      url: "follower/getPagingList",
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

  // 팔로워 삭제
  const sendFollowDeleteData = (data, idx) => {
    fnc.executeQuery({
      url: "follower/delete",
      data: {
        username: localUser,
        target: data,
      },
      success: (res) => {
        const newList = [...list];
        newList[idx].followerYn = "N";
        setList(newList);
      },
    });
  };

  // 삭제 버튼 클릭 시
  const onDeleteBtnClick = (data, idx) => {
    sendFollowDeleteData(data.follower, idx);
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
    sendFollowYnData(data.follower, idx);
  };

  // 모달창 나가기 버튼 클릭 시
  const onExitBtnClick = () => {
    setFollowerModalOn(false);
  };

  useEffect(() => {
    if (localUser === paramsId) {
      getFollowerData(localUser, localUser);
    } else {
      getFollowerData(localUser, paramsId);
    }
  }, []);

  // 스크롤 감지
  const handleScroll = () => {
    const scrollHeight = scrollRef.current.scrollHeight;
    const scrollTop = scrollRef.current.scrollTop;
    const clientHeight = scrollRef.current.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      ++page;
      getAddFollowerData(page);
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
          <h4>팔로워</h4>
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
                      <div>
                        <h4>{data.nickname}</h4>
                        <h5>{data.name}</h5>
                      </div>
                      {data.followYn === "N" && data.followerYn === "Y" ? (
                        <button onClick={() => followBtnClick(data, idx)}>
                          • 팔로우
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="subs-cancle">
                      {data.followerYn === "Y" ? (
                        <button onClick={() => onDeleteBtnClick(data, idx)}>
                          삭제
                        </button>
                      ) : (
                        ""
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
                      {localUser === data.follower ? (
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

export default FollowerModal;
