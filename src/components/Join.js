import React, { useEffect, useState } from "react";
import kakaoLogo from "../images/kakaoLogo.svg.png";
import googleLogo from "../images/Google__G__Logo.svg.png";
import { Link } from "react-router-dom";

const Join = () => {
  //   const [inputData, setInputData] = useState({
  //     usermail: "",
  //     userid: "",
  //     nickname: "",
  //     name: "",
  //     password: "",
  //     passwordChecked: "",
  //   });
  const [usermail, setUsermail] = useState(""); // 이메일 주소
  const [userid, setUserid] = useState(""); // 아이디
  const [nickname, setNickname] = useState(""); // 사용자 이름
  const [name, setName] = useState(""); // 성명
  const [password, setPassword] = useState(""); // 비밀번호
  const [passwordChecked, setPasswordChecked] = useState(""); // 비밀번호 확인
  const [emailError, setEmailError] = useState(false); // 이메일 양식 체크
  const [idError, setIdError] = useState(false); // 아이디 양식 체크
  const [nameError, setNameError] = useState(false); // 성명 양식 체크
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 양식 체크
  const [passwordIsSame, setPasswordIsSame] = useState(false); // 비밀번호 일치 여부 체크
  // input 제어
  const onChangeUsermailHandler = (e) => {
    setUsermail(e.target.value);
    setEmailError(validateEmail(e.target.value));
  };
  const onChangeUseridHandler = (e) => {
    setUserid(e.target.value);
    setIdError(validateId(e.target.value));
  };
  const onChangeNicknameHandler = (e) => {
    setNickname(e.target.value);
  };
  const onChangeNameHandler = (e) => {
    setName(e.target.value);
    setNameError(validateName(e.target.value));
  };
  const onChangePasswordHandler = (e) => {
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value));
  };
  const onChangePasswordCheckedHandler = (e) => {
    setPasswordChecked(e.target.value);
    setPasswordIsSame(e.target.value !== password);
  };

  // 유효성 검사

  // 이메일 유효성 검사
  const validateEmail = (usermail) => {
    const regExp =
      /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i;
    if (regExp.test(usermail)) {
      return false;
    } else if (usermail === "") {
      return false;
    } else {
      return true;
    }
  };

  // 이름 유효성 검사
  const validateName = (name) => {
    const reg = /^[가-힣]{2,6}$/;
    if (reg.test(name)) {
      return false;
    } else if (name === "") {
      return false;
    } else {
      return true;
    }
  };

  // 아이디 유효성 검사
  const validateId = (userid) => {
    // 아이디 정규식 - 영문 대문자 또는 소문자 또는 숫자로 시작하는 아이디, 길이는 6 ~ 18자, 끝날때 제한 없음
    const reg = /^[A-za-z0-9]{6,18}$/;
    if (reg.test(userid)) {
      return false;
    } else if (userid === "") {
      return false;
    } else {
      return true;
    }
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    // 비밀번호 정규식 - 숫자, 영문, 특수문자 1개이상 을 포함한 8~20자
    const reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,20}$/;
    if (reg.test(password)) {
      return false;
    } else if (password === "") {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <div>
        <div id="form">
          <div className="form-logo">
            <h1>Eatstagram</h1>
            <h4>나만의 맛집을 친구들과 공유하고 싶다면 가입하세요.</h4>
          </div>
          <form action="main.html" method="GET" id="join-form">
            {/*구글 소셜 로그인*/}
            <div className="googlebtn">
              <a className="oauth-container btn darken-4 white black-text">
                <div className="inside__google">
                  <img alt="Google sign-in" src={googleLogo} />
                  <span>Start with Google</span>
                </div>
              </a>
            </div>
            {/*카카오 소셜 로그인*/}
            <div className="kakaobtn">
              <a className="oauth-container btn darken-4 white black-text">
                <div className="inside__kakao">
                  <img alt="Kakao sign-in" src={kakaoLogo} />
                  <span>Start with Kakao</span>
                </div>
              </a>
            </div>
            <div className="line">
              <span>또는</span>
            </div>
            <input
              name="usermail"
              type="text"
              placeholder="이메일 주소"
              value={usermail}
              onChange={onChangeUsermailHandler}
            />
            {emailError && (
              <div style={{ color: "red" }}>
                이메일 형식이 일치하지 않습니다.
              </div>
            )}
            <input
              name="userid"
              type="text"
              placeholder="아이디"
              value={userid}
              onChange={onChangeUseridHandler}
            />
            {idError && (
              <div style={{ color: "red" }}>
                아이디 형식이 일치하지 않습니다.
              </div>
            )}
            <input
              name="nickname"
              type="text"
              placeholder="사용자 이름"
              value={nickname}
              onChange={onChangeNicknameHandler}
            />
            <input
              name="name"
              type="text"
              placeholder="성명"
              value={name}
              onChange={onChangeNameHandler}
            />
            {nameError && (
              <div style={{ color: "red" }}>이름 형식이 일치하지 않습니다.</div>
            )}
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={onChangePasswordHandler}
            />
            {passwordError && (
              <div style={{ color: "red" }}>
                비밀번호 형식이 일치하지 않습니다.
              </div>
            )}
            <input
              name="passwordChecked"
              type="password"
              placeholder="비밀번호 확인"
              value={passwordChecked}
              onChange={onChangePasswordCheckedHandler}
            />
            {passwordIsSame && (
              <div style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</div>
            )}
            <input type="submit" value="가입" />
          </form>
        </div>

        <div className="form-bottom__btn">
          <h2>계정이 있으신가요?</h2>
          <Link to="/">
            <h2 className="form-bottom__link">로그인</h2>
          </Link>
        </div>
      </div>
      <div id="footer">
        <div>
          <ul className="footer-top">
            <li>소개</li>
            <li>블로그</li>
            <li>채용 정보</li>
            <li>도움말</li>
            <li>API</li>
            <li>개인정보처리방침</li>
            <li>약관</li>
            <li>인기 계정</li>
            <li>해시태그</li>
            <li>위치</li>
          </ul>
        </div>
        <div className="footer-bottom">
          <p>© 2021 Eatstagram from JinYedo ParkSangJun BaeGyuri</p>
        </div>
      </div>
    </>
  );
};

export default Join;
