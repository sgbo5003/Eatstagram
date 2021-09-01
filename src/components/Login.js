import React from "react";

import kakaoLogo from "../images/kakaoLogo.svg.png";
import googleLogo from "../images/Google__G__Logo.svg.png";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <>
      <div>
        <div id="form">
          <div class="form-logo">
            <h1>Eatstagram</h1>
          </div>

          <form action="main.html" method="GET" id="login-form">
            <input name="userid" type="text" placeholder="아이디" />
            <input name="userpassword" type="password" placeholder="비밀번호" />
            <input type="submit" value="로그인" />
            <div class="line">
              <span>또는</span>
            </div>
            {/*구글 소셜 로그인*/}
            <div class="googlebtn">
              <a class="oauth-container btn darken-4 white black-text">
                <div class="inside__google">
                  <img alt="Google sign-in" src={googleLogo} />
                  <span>Login with Google</span>
                </div>
              </a>
            </div>
            {/*카카오 소셜 로그인*/}
            <div class="kakaobtn">
              <a class="oauth-container btn darken-4 white black-text">
                <div class="inside__kakao">
                  <img alt="Kakao sign-in" src={kakaoLogo} />
                  <span>Login with Kakao</span>
                </div>
              </a>
            </div>
            <Link to="/FindPassword">
              <h4>비밀번호를 잊으셨나요?</h4>
            </Link>
          </form>
        </div>

        <div class="form-bottom__btn">
          <h2>계정이 없으신가요?</h2>
          <Link to="/Join">
            <h2 class="form-bottom__link">가입하기</h2>
          </Link>
        </div>
      </div>

      <div id="footer">
        <div>
          <ul class="footer-top">
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
        <div class="footer-bottom">
          <p>© 2021 Eatstagram from JinYedo ParkSangJun BaeGyuri</p>
        </div>
      </div>
    </>
  );
};

export default Login;
