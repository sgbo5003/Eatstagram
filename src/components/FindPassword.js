import React from "react";
import { Link } from "react-router-dom";
import { FaUserLock } from "react-icons/fa";
import Footer from "./Footer";

const FindPassword = () => {
  return (
    <>
      <div>
        <div id="form">
          <div className="form-logo__find">
            <h3>Eatstagram</h3>
            <h1>
              <FaUserLock />
            </h1>
            <h2>비밀 번호를 잊으셨나요?</h2>
            <h4>이메일 주소를 입력하시면 비밀번호를 변경할 수 있는 링크를</h4>
            <h4>보내드립니다.</h4>
          </div>
          <form action="main.html" method="GET" id="find-form">
            <input name="usermail" type="text" placeholder="이메일 주소" />
            <input type="submit" value="비밀번호 변경 링크 보내기" />
            <div className="line">
              <span>또는</span>
            </div>
            <Link to="/Join">
              <h4>새 계정 만들기</h4>
            </Link>
          </form>
        </div>
        <div className="form-bottom__btn">
          <Link to="/">
            <h2 className="form-bottom__link">로그인</h2>
          </Link>
          <h2>으로 돌아가기</h2>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FindPassword;
