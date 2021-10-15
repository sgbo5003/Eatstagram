import React, { useEffect, useState } from "react";
import * as fncObj from "../../commonFunc/CommonObjFunctions";

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
                    <h4> {data.name}</h4>
                  </div>
                </div>
                <aside>
                  {getLocalUserName === data.username ? (
                    ""
                  ) : data.subscriptionYn === "Y" ? (
                    <button>구독중</button>
                  ) : (
                    <button>구독</button>
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
