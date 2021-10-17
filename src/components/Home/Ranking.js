import React, { useEffect, useState } from "react";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import * as fnc from "../../commonFunc/CommonFunctions";
import profileDefaultImg from "../../../public/images/default_user.png";
import rankImg from "../../../public/images/rank.png";
import { useHistory } from "react-router";

let page = 0;

const Ranking = (props) => {
  const { profileFilePath } = props;
  const getLocalUserName = localStorage.getItem("username");
  const history = useHistory();
  const [rankingList, setRankingList] = useState([]);
  const getRankingData = () => {
    fncObj.executeQuery({
      url: "getRankingPagingList",
      data: {
        page: 0,
        size: 10,
        username: getLocalUserName,
      },
      success: (res) => {
        setRankingList(res.content);
      },
    });
  };

  const getAddRankingData = (page) => {
    fncObj.executeQuery({
      url: "getRankingPagingList",
      data: {
        page: page,
        size: 10,
        username: getLocalUserName,
      },
      success: (res) => {
        if (res.content.length > 0) {
          setRankingList(rankingList.concat(res.content));
        }
      },
    });
  };

  // 스크롤 감지
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      ++page;
      getAddRankingData(page);
    }
  };

  // 스크롤 이벤트
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  // 팔로우 추가 및 삭제
  const sendFollowYnData = (data, idx) => {
    fnc.executeQuery({
      url: "follow/save",
      data: {
        username: getLocalUserName,
        target: data,
      },
      success: (res) => {
        const newList = [...rankingList];
        newList[idx].followYn = res.followYn;
        setRankingList(newList);
      },
    });
  };

  // 맞팔 & 언팔 & 팔로우 버튼 클릭 시
  const FollowBtnClick = (data, idx) => {
    sendFollowYnData(data.username, idx);
  };

  const onProfileClick = (data) => {
    history.push(`/Profile?username=${data.username}`);
  };

  useEffect(() => {
    getRankingData();
  }, []);

  return (
    <div className="main-area">
      <div className="ranking-area">
        <div className="ranking-title">
          <img src={rankImg} />
          <h1>Eatstagram Ranking </h1>
        </div>
        <div className="ranking-list">
          {rankingList.map((data, idx) => {
            return (
              <div className="rank" key={idx}>
                <aside>
                  <h1>{idx + 1}위</h1>
                </aside>
                <div className="rank-info">
                  <div className="rank__img">
                    <img
                      src={
                        data.profileImgName === null
                          ? profileDefaultImg
                          : profileFilePath + data.profileImgName
                      }
                      alt=""
                      onClick={() => onProfileClick(data)}
                    />
                  </div>
                  <div>
                    <div className="rank__user">
                      <h2 onClick={() => onProfileClick(data)}>
                        {data.nickname}
                      </h2>
                      <h4>{data.name}</h4>
                    </div>
                    <div className="rank-follower">
                      <h4>팔로워 수 {data.followerCount}명</h4>
                    </div>
                  </div>
                </div>
                <aside>
                  {getLocalUserName === data.username ? (
                    ""
                  ) : data.followYn === "N" && data.followerYn === "Y" ? (
                    <button onClick={() => FollowBtnClick(data, idx)}>
                      맞팔로우
                    </button>
                  ) : (data.followYn === "Y" && data.followerYn === "Y") ||
                    (data.followYn === "Y" && data.followerYn === "N") ? (
                    <button
                      className="unfollow"
                      onClick={() => FollowBtnClick(data, idx)}
                    >
                      언팔로우
                    </button>
                  ) : (
                    <button onClick={() => FollowBtnClick(data, idx)}>
                      팔로우
                    </button>
                  )}
                </aside>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Ranking;
