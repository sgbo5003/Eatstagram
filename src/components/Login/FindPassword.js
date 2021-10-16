import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { FaUserLock } from "react-icons/fa";
import * as fnc from "../../commonFunc/CommonFunctions";
import Footer from "../Footer";

const FindPassword = () => {
  const [inputId, setInputId] = useState("");
  const history = useHistory();

  const onChangeIdHandler = (e) => {
    setInputId(e.target.value);
  };

  const sendFindPasswordLink = () => {
    fnc.executeQuery({
      url: "sendFindPasswordLink",
      data: {
        username: inputId,
      },
      success: (res) => {
        alert(res.msg);
      },
      fail: (res) => {
        alert(res.data.msg);
      },
      error: (res) => {
        alert(res.msg);
      },
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendFindPasswordLink();
  };
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
            <h4>회원가입때 입력했던 이메일 주소로 비밀번호 링크를</h4>
            <h4>보내드립니다.</h4>
          </div>
          <form action="main.html" method="GET" id="find-form">
            <input
              name="usermail"
              type="text"
              placeholder="아이디를 입력해주세요."
              value={inputId}
              onChange={onChangeIdHandler}
            />
            <input
              type="submit"
              value="비밀번호 변경 링크 보내기"
              onClick={onSubmit}
            />
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
