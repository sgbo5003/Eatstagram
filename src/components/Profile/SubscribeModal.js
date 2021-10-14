import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisH, FaTimes } from "react-icons/fa";
import profileDefaultImg from "../../../public/images/default_user.png";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import * as fnc from "../../commonFunc/CommonFunctions";

let page = 0;

const SubscribeModal = (props) => {
  const { localUser, paramsId } = props;
  const [list, setList] = useState([]);
  const [subscribeBtn, setSubscribeBtn] = useState(false);
  const scrollRef = useRef(null);

  // 구독자 리스트 data 불러오기
  const getSubscribeData = (user, other) => {
    fncObj.executeQuery({
      url: "subscription/getPagingList",
      data: {
        username: user,
        condition: other,
        page: 0,
        size: 6,
      },
      success: (res) => {
        setList(res.content);
      },
    });
  };

  // 스크롤 했을 때 데이터 더 가져오기
  const getAddSubscribeData = (user, other, page) => {
    fncObj.executeQuery({
      url: "subscription/getPagingList",
      data: {
        page: page,
        size: 6,
        username: user,
        condition: other,
      },
      success: (res) => {
        if (res.content.length > 0) setList(list.concat(res.content));
      },
    });
  };

  // 구독 추가 및 삭제
  const sendSubscriptionYnData = (data) => {
    fnc.executeQuery({
      url: "subscription/save",
      data: {
        username: data,
        subscriber: localUser,
      },
      success: (res) => {},
    });
  };

  // 구독 취소 버튼 클릭 시
  const onSubscribeBtnClick = (data) => {
    sendSubscriptionYnData(data.subscriber);
    setSubscribeBtn(!subscribeBtn);
  };

  useEffect(() => {
    if (localUser === paramsId) {
      getSubscribeData(localUser, localUser);
    } else {
      getSubscribeData(localUser, paramsId);
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
          <h4>구독</h4>
          <p>
            <FaTimes />
          </p>
        </div>
        <div className="subs__bottom">
          <div className="subs-list-area" ref={scrollRef}>
            {list.map((data, idx) => {
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
                    {localUser === data.subscriber ? (
                      ""
                    ) : subscribeBtn ? (
                      <button onClick={() => onSubscribeBtnClick(data)}>
                        구독신청
                      </button>
                    ) : (
                      <button onClick={() => onSubscribeBtnClick(data)}>
                        구독취소
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribeModal;
