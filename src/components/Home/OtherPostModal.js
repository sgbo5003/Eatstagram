import React, { useEffect } from "react";
import { useHistory } from "react-router";
import * as fnc from "../../commonFunc/CommonFunctions";

const OtherPostModal = (props) => {
  const {
    setOtherPostModalOn,
    otherPostData,
    getLocalUserName,
    follow,
    follower,
    setFollow,
  } = props;
  const history = useHistory();

  const onCancelClick = () => {
    setOtherPostModalOn(false);
  };

  useEffect(() => {
    console.log(otherPostData);
  }, []);

  // 팔로우 추가 및 삭제
  const sendFollowYnData = () => {
    fnc.executeQuery({
      url: "follow/save",
      data: {
        username: getLocalUserName,
        target: otherPostData.username,
      },
      success: (res) => {
        setFollow(res.followYn);
      },
    });
  };

  // 맞팔 & 언팔 & 팔로우 버튼 클릭 시
  const followBtnClick = () => {
    sendFollowYnData();
  };

  return (
    <div className="delete-window">
      <div className="delete-area">
        <div className="delete-btn">
          {follow === "N" && follower === "Y" ? (
            <button onClick={followBtnClick}>맞팔로우</button>
          ) : (follow === "Y" && follower === "Y") ||
            (follow === "Y" && follower === "N") ? (
            <button onClick={followBtnClick}>언팔로우</button>
          ) : (
            <button onClick={followBtnClick}>팔로우</button>
          )}
        </div>
        <div className="delete-cancle-btn">
          <button onClick={onCancelClick}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default OtherPostModal;
