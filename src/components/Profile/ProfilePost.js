import React, { useEffect, useState } from "react";
import myProfileImg from "../../../public/images/묭수.jpg";
import * as fncObj from "../../commonFunc/CommonObjFunctions";

let page = 0;

const ProfilePost = () => {
  const localUserName = localStorage.getItem("username");
  const [posts, setPosts] = useState([]);
  const getData = () => {
    fncObj.executeQuery({
      url: "content/getMyPagingList",
      data: {
        page: 0,
        size: 6,
        username: localUserName,
      },
      success: (res) => {
        setPosts(res.content);
      },
    });
  };

  const getAddData = (page) => {
    fncObj.executeQuery({
      url: "content/getMyPagingList",
      data: {
        page: page,
        size: 6,
        username: localUserName,
      },
      success: (res) => {
        if (res.content.length > 0) setPosts(posts.concat(res.content));
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
      getAddData(page);
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
    getData();
  }, []);
  return (
    <div className="profile-area__post">
      {posts.map((data, idx) => {
        return (
          <img
            src={`upload/content/${data.contentFileDTOList[0].name}`}
            alt={`게시글${idx}`}
            key={idx}
          />
        );
      })}
    </div>
  );
};

export default ProfilePost;
