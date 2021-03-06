import React, { useEffect, useState } from "react";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import * as fnc from "../../commonFunc/CommonFunctions";
import profileDefaultImg from "../../../public/images/default_user.png";
import { useHistory } from "react-router";
let page = 0;
const SearchUserResult = (props) => {
  const { localUser, paramsId, profileFilePath } = props;
  const history = useHistory();
  const [userList, setUserList] = useState([]);

  const getUserSearchResultData = () => {
    fncObj.executeQuery({
      url: "getSearchPagingList",
      data: {
        page: 0,
        size: 9,
        username: localUser,
        condition: paramsId,
      },
      success: (res) => {
        setUserList(res.content);
      },
    });
  };

  const getAddUserSearchResultData = (page) => {
    fncObj.executeQuery({
      url: "getSearchPagingList",
      data: {
        page: page,
        size: 9,
        username: localUser,
        condition: paramsId,
      },
      success: (res) => {
        if (res.content.length > 0) {
          setUserList(userList.concat(res.content));
        }
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
        const newList = [...userList];
        newList[idx].followYn = res.followYn;
        setUserList(newList);
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

  // 스크롤 감지
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      ++page;
      getAddUserSearchResultData(page);
    }
  };

  // 스크롤 이벤트
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  useEffect(() => {
    getUserSearchResultData();
    page = 0;
  }, [paramsId]);
  return (
    <div className="search-result">
      {userList.map((data, idx) => {
        return (
          <div className="search-result__list" key={idx}>
            <div className="search-result-user">
              <img
                src={
                  data.profileImgName === null
                    ? profileDefaultImg
                    : profileFilePath + data.profileImgName
                }
                alt=""
                onClick={() => onProfileClick(data)}
              />
              <div className="search-result__info">
                <h1 onClick={() => onProfileClick(data)}>{data.nickname}</h1>
                <h4>{data.name}</h4>
              </div>
            </div>
            {localUser === data.username ? (
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
              <button onClick={() => FollowBtnClick(data, idx)}>팔로우</button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SearchUserResult;
