import React, { useEffect, useState } from "react";
import kakaoLogo from "../../../public/images/kakaoLogo.svg.png";
import googleLogo from "../../../public/images/Google__G__Logo.svg.png";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer";
import * as fnc from "../../commonFunc/CommonFunctions";

const Join = () => {
  const [usermail, setUsermail] = useState(""); // 이메일 주소
  const [userid, setUserid] = useState(""); // 아이디
  const [nickname, setNickname] = useState(""); // 사용자 이름
  const [nicknameError, setNickNameError] = useState(false); // 사용자 이름 일치 여부 확인 (db)
  const [name, setName] = useState(""); // 성명
  const [password, setPassword] = useState(""); // 비밀번호
  const [passwordChecked, setPasswordChecked] = useState(""); // 비밀번호 확인
  const [emailError, setEmailError] = useState(false); // 이메일 양식 체크
  //   const [idIsOk, setIdIsOk] = useState(false);
  const [idError, setIdError] = useState(false); // 아이디 양식 체크
  const [idCheckError, setIdCheckError] = useState(false); // 아이디 일치여부 확인 (DB)
  const [idCheckIsOk, setIdCheckIsOk] = useState(false);
  const [nameError, setNameError] = useState(false); // 성명 양식 체크
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 양식 체크
  const [passwordIsSame, setPasswordIsSame] = useState(false); // 비밀번호 일치 여부 체크
  const [button, setButton] = useState(false);
  const history = useHistory();

  // input 제어
  const onChangeUsermailHandler = (e) => {
    setUsermail(e.target.value);
    setEmailError(validateEmail(e.target.value));
  };

  const onChangeUseridHandler = (e) => {
    setUserid(e.target.value);
    if (!idCheckError) {
      setIdError(validateId(e.target.value));
    }
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

  const sendData = () => {
    fnc.executeQuery({
      url: "join/step/one",
      data: {
        email: usermail,
        username: userid,
        nickname: nickname,
        name: name,
        password: password,
        confirmPassword: passwordChecked,
      },
      success: (res) => {
        sessionStorage.setItem("joinToken", res.joinToken);
        history.push("/JoinEmail");
      },
      fail: (res) => {
        alert("값을 제대로 입력해주세요.");
        console.log(res);
      },
    });
  };

  const getUseridData = () => {
    fnc.executeQuery({
      url: "checkUsername",
      data: {
        username: userid,
      },
      success: (res) => {
        setIdCheckError(false);
      },
      fail: (res) => {
        setIdCheckError(true);
      },
    });
  };

  const getNickNameData = () => {
    fnc.executeQuery({
      url: "checkNickname",
      data: {
        nickname: nickname,
      },
      success: (res) => {
        setNickNameError(false);
      },
      fail: (res) => {
        setNickNameError(true);
      },
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (
      emailError == true ||
      passwordError == true ||
      nicknameError == true ||
      passwordIsSame == true ||
      idError == true ||
      idCheckError == true ||
      nameError == true
    ) {
      alert("형식을 다시 확인해주세요");
      return;
    } else if (
      usermail === "" ||
      userid === "" ||
      nickname === "" ||
      name === "" ||
      password === "" ||
      passwordChecked === ""
    ) {
      alert("값이 비어있습니다");
      return;
    } else {
      sendData();
    }
  };

  const checkBtnOn = () => {
    if (
      usermail === "" ||
      userid === "" ||
      nickname === "" ||
      name === "" ||
      password === "" ||
      passwordChecked === ""
    ) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    checkBtnOn();
  });
  return (
    <>
      <div>
        <div id="form">
          <div className="form-logo">
            <h1>Eatstagram</h1>
            <h4>나만의 맛집을 친구들과 공유하고 싶다면 가입하세요.</h4>
          </div>
          <form id="join-form">
            <div className="title">이메일</div>
            <input
              name="usermail"
              type="text"
              placeholder="이메일 주소"
              value={usermail}
              onChange={onChangeUsermailHandler}
              onBlur={onChangeUsermailHandler}
            />
            {emailError && (
              <div
                style={{
                  color: "red",
                  paddingRight: "110px",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                이메일 형식이 일치하지 않습니다.
              </div>
            )}
            <div className="title">아이디</div>
            <input
              name="userid"
              type="text"
              placeholder="영문 또는 숫자로 조합, 길이는 6 ~ 18자"
              value={userid}
              onChange={onChangeUseridHandler}
              onBlur={getUseridData}
            />
            {idError && (
              <div
                style={{
                  color: "red",
                  paddingRight: "110px",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                아이디 형식이 일치하지 않습니다.
              </div>
            )}
            {idCheckError && (
              <div
                style={{
                  color: "red",
                  paddingRight: "172px",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                아이디가 중복됩니다.
              </div>
            )}
            <div className="title">닉네임</div>
            <input
              name="nickname"
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={onChangeNicknameHandler}
              onBlur={getNickNameData}
            />
            {nicknameError && (
              <div
                style={{
                  color: "red",
                  paddingRight: "172px",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                닉네임이 중복됩니다.
              </div>
            )}
            <div className="name">성명</div>
            <input
              name="name"
              type="text"
              placeholder="성명"
              value={name}
              onChange={onChangeNameHandler}
            />
            {nameError && (
              <div
                style={{
                  color: "red",
                  paddingRight: "121px",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                이름 형식이 일치하지 않습니다.
              </div>
            )}
            <div className="pwd">비밀번호</div>
            <input
              name="password"
              type="password"
              placeholder="숫자, 영문, 특수문자 1개이상 을 포함한 8~20자"
              value={password}
              onChange={onChangePasswordHandler}
            />
            {passwordError && (
              <div
                style={{
                  color: "red",
                  paddingRight: "97px",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                비밀번호 형식이 일치하지 않습니다.
              </div>
            )}
            <div className="confirmpwd">비밀번호 확인</div>
            <input
              name="passwordChecked"
              type="password"
              placeholder="비밀번호 확인"
              value={passwordChecked}
              onChange={onChangePasswordCheckedHandler}
            />
            {passwordIsSame && (
              <div
                style={{
                  color: "red",
                  paddingRight: "121px",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                비밀번호가 일치하지 않습니다.
              </div>
            )}
          </form>
          <div className="submit-btn__join">
            {button ? (
              <button type="submit" className="noselected" onClick={onSubmit}>
                다음
              </button>
            ) : (
              <button
                type="submit"
                className="selected"
                disabled
                onClick={onSubmit}
              >
                다음
              </button>
            )}
          </div>
        </div>
        <div className="form-bottom__btn">
          <h2>계정이 있으신가요?</h2>
          <Link to="/">
            <h2 className="form-bottom__link">로그인</h2>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Join;
