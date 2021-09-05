import React, { useEffect, useRef, useState } from "react";

const Main = () => {
  useEffect(() => {
    const videoStartPoint = window.innerHeight / 2.5; // 비디오 시작 지점
    const videoIds = [];

    // 재생시킬 <video> 태그의 id 값들을 저장하기 위한 반복문
    for (let i = 1; i <= document.getElementsByTagName("video").length; i++) {
      // .wrap의 자식요소(<video> 태그)만큼 반복
      videoIds.push(
        document
          .querySelector(".wrap video:nth-child(" + i + ")")
          .getAttribute("id")
      ); // 반복 요소의 id값을 배열에 저장
    }

    document.addEventListener("scroll", function () {
      // 스크롤시 이벤트 발생
      videoIds.forEach((element) => {
        // 배열의 개수(<video> 태그의 수) 만큼 반복
        const elementTop = document
          .querySelector("#" + element)
          .getBoundingClientRect().top; // 반복 요소(<video> 태그)의 현재 위치값

        if (
          elementTop < videoStartPoint &&
          elementTop > window.innerHeight / 100
        ) {
          document.querySelector("#" + element).play();
        } else if (elementTop > videoStartPoint || elementTop < 0) {
          document.querySelector("#" + element).pause();
        }
      });
    });
  }, []);

  return (
    <div className="wrap">
      <video
        controls
        muted="muted"
        id="test1"
        width="500"
        style={{ margin: "40px" }}
      >
        <source
          src="http://localhost:8080/stream/왜그래.mp4"
          type="video/mp4"
        ></source>
      </video>

      <video
        controls
        muted="muted"
        id="test2"
        width="500"
        style={{ margin: "40px" }}
      >
        <source
          src="http://localhost:8080/stream/왜그래.mp4"
          type="video/mp4"
        ></source>
      </video>

      <video
        controls
        muted="muted"
        id="test3"
        width="500"
        style={{ margin: "40px" }}
      >
        <source
          src="http://localhost:8080/stream/왜그래.mp4"
          type="video/mp4"
        ></source>
      </video>

      <video
        controls
        muted="muted"
        id="test4"
        width="500"
        style={{ margin: "40px" }}
      >
        <source
          src="http://localhost:8080/stream/왜그래.mp4"
          type="video/mp4"
        ></source>
      </video>

      <video
        controls
        muted="muted"
        id="test5"
        width="500"
        style={{ margin: "40px" }}
      >
        <source
          src="http://localhost:8080/stream/왜그래.mp4"
          type="video/mp4"
        ></source>
      </video>
    </div>
  );
};

export default Main;
