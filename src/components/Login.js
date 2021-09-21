import React, { useRef, useState } from "react";
import kakaoLogo from "../../public/images/kakaoLogo.svg.png";
import googleLogo from "../../public/images/Google__G__Logo.svg.png";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import KakaoLogin from "react-kakao-login";
import * as fnc from "../commonFunc/CommonFunctions";
const Login = () => {
  const history = useHistory();
  const [userid, setUserid] = useState(""); // 성명
  const [password, setPassword] = useState(""); // 비밀번호
  const idRef = useRef(null);
  const passwordRef = useRef(null);

  const kakaoAppKey = "6bd6889a5435fbc5a9c77e8d49c9e5f3";
  // http://localhost:3000/oauth2/authorization/google -> google

  const onChangeUseridHandler = (e) => {
    setUserid(e.target.value);
  };

  const onChangePasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const kakaoSuccess = (data) => {
    fnc.executeQuery({
      url: "oauth2/authorization/kakao",
      data: {},
      success: (res) => {
        localStorage.setItem("username", res.username);
        location.reload();
      },
      fail: (res) => {
        alert("카카오톡 로그인 실패");
      },
    });
  };

  const sendData = () => {
    fnc.executeQuery({
      url: "",
      data: {
        username: userid,
        password: password,
      },
      success: (res) => {
        localStorage.setItem("username", res.username);
        location.reload();
      },
      fail: (res) => {
        alert(res.data.msg);
      },
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // trim() 공백 제거 (문자열의 양쪽 공백을 제거)
    if (userid.trim() === "") {
      idRef.current.focus();
      alert("아이디를 입력해주세요.");
    } else if (password.trim() === "") {
      passwordRef.current.focus();
      alert("비밀번호를 입력해주세요.");
    } else {
      sendData();
    }
  };

  return (
    <>
      <div>
        <div id="form">
          <div className="form-logo">
            <h1>Eatstagram</h1>
          </div>
          <form action="main.html" method="GET" id="login-form">
            <input
              name="userid"
              type="text"
              placeholder="아이디"
              value={userid}
              ref={idRef}
              onChange={onChangeUseridHandler}
            />
            <input
              name="userpassword"
              type="password"
              placeholder="비밀번호"
              value={password}
              ref={passwordRef}
              onChange={onChangePasswordHandler}
            />
            <input type="submit" value="로그인" onClick={onSubmit} />
            <div className="line">
              <span>또는</span>
            </div>
            {/*구글 소셜 로그인*/}
            <div className="googlebtn">
              <a className="oauth-container btn darken-4 white black-text">
                <div className="inside__google">
                  <img alt="Google sign-in" src={googleLogo} />
                  <span>Login with Google</span>
                </div>
              </a>
            </div>
            {/*카카오 소셜 로그인*/}
            <KakaoLogin
              className="KaKaoLogin"
              onSuccess={kakaoSuccess}
              onFail={console.log}
              token={kakaoAppKey}
            >
              <img src={kakaoLogo} alt="kakao" />
              <span>Login with Kakao</span>
            </KakaoLogin>
            <Link to="/FindPassword">
              <h4>비밀번호를 잊으셨나요?</h4>
            </Link>
          </form>
        </div>

        <div className="form-bottom__btn">
          <h2>계정이 없으신가요?</h2>
          <Link to="/Join">
            <h2 className="form-bottom__link">가입하기</h2>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
