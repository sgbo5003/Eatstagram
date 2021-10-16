import React, { useEffect, useState } from "react";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import * as fnc from "../../commonFunc/CommonFunctions";

const Ranking = () => {
  const getLocalUserName = localStorage.getItem("username");
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

  useEffect(() => {
    getRankingData();
  }, []);

  return (
    <div className="main-area">
      <div className="ranking-area">
        <div className="ranking-title">
          <img src="./images/rank.png" />
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
                    <img src="./images/1위.jpg" alt="" />
                  </div>
                  <div className="rank__user">
                    <h2>{data.nickname}</h2>
                    <h4> • {data.name}</h4>
                    <h4> • {data.followerCount}명</h4>
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
                    <button onClick={() => FollowBtnClick(data, idx)}>
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
