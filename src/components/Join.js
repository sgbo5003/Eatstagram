import React, { useEffect, useState } from "react";
import kakaoLogo from "../images/kakaoLogo.svg.png";
import googleLogo from "../images/Google__G__Logo.svg.png";
import cancelImg from "../images/cancel.png";
import okImg from "../images/ok.png";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import KakaoLogin from "react-kakao-login";
// import * as fnc from "../commonFunc/CommonFunctions";

const Join = () => {
  const [usermail, setUsermail] = useState(""); // 이메일 주소
  const [userid, setUserid] = useState(""); // 아이디
  const [nickname, setNickname] = useState(""); // 사용자 이름
  const [nicknameError, setNickNameError] = useState(false); // 사용자 이름 일치 여부 확인 (db)
  const [nicknameIsOk, setNickNameIsOk] = useState(false);
  const [name, setName] = useState(""); // 성명
  const [password, setPassword] = useState(""); // 비밀번호
  const [passwordChecked, setPasswordChecked] = useState(""); // 비밀번호 확인
  const [emailError, setEmailError] = useState(false); // 이메일 양식 체크
  const [idError, setIdError] = useState(false); // 아이디 양식 체크
  const [idCheckError, setIdCheckError] = useState(false); // 아이디 일치여부 확인 (DB)
  const [idCheckIsOk, setIdCheckIsOk] = useState(false);
  const [nameError, setNameError] = useState(false); // 성명 양식 체크
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 양식 체크
  const [passwordIsSame, setPasswordIsSame] = useState(false); // 비밀번호 일치 여부 체크
  const [button, setButton] = useState(false);
  const hitory = useHistory();
  const kakaoAppKey = "6bd6889a5435fbc5a9c77e8d49c9e5f3";
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

  const sendData = () => {
    const params = {
      email: usermail,
      username: userid,
      nickname: nickname,
      name: name,
      password: password,
      confirmPassword: passwordChecked,
    };
    axios({
      method: "post",
      url: "join/step/one",
      data: params,
    })
      .then((response) => {
        console.log(response);
        if (response.data.response == "fail") {
          alert("값을 제대로 입력해주세요.");
        } else if (response.data.response == "ok") {
          hitory.push("/JoinEmail");
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUseridData = () => {
    const params = new FormData();
    params.append("username", userid);
    axios({
      method: "post",
      url: "checkUsername",
      data: params,
    })
      .then((response) => {
        console.log(response);
        if (response.data.response === "ok") {
          setIdCheckError(false);
          setIdCheckIsOk(true);
        } else if (response.data.response === "fail") {
          setIdCheckError(true);
          setIdCheckIsOk(false);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getNickNameData = () => {
    const params = new FormData();
    params.append("nickname", nickname);
    axios({
      method: "post",
      url: "checkNickname",
      data: params,
    })
      .then((response) => {
        console.log(response);
        if (response.data.response === "ok") {
          setNickNameError(false);
          setNickNameIsOk(true);
        } else if (response.data.response === "fail") {
          setNickNameError(true);
          setNickNameIsOk(false);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (
      emailError ||
      passwordError ||
      nicknameError ||
      nicknameIsOk ||
      passwordIsSame ||
      idError ||
      idCheckError ||
      idCheckIsOk ||
      nameError
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
    }
    sendData();
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

  //   const kakaoSuccess = () => {
  //     axios({
  //       method: "post",
  //       url: "login/oauth2/code/kakao",
  //       data: {},
  //     })
  //       .then((response) => {
  //         console.log(response);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         console.log("hi");
  //       });
  //   };

  const kakaoSuccess = (data) => {
    // const social_id = data.profile.id; // 고유번호
    // const social_name = data.profile.properties.nickname; // 이름
    // const social_email = data.profile.kakao_account.email; // 이메일
    // const social_profileImg = data.profile.properties.profile_image; // 프로필 이미지
    const params = new FormData();
    params.append("data", data);
    axios({
      method: "post",
      url: "login/oauth2/code/kakao",
      data: params,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        console.log("hi");
      });
  };

  return (
    <>
      <div>
        <div id="form">
          <div className="form-logo">
            <h1>Eatstagram</h1>
            <h4>나만의 맛집을 친구들과 공유하고 싶다면 가입하세요.</h4>
          </div>
          <form id="join-form">
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
            {/* <div className="kakaobtn">
              <a
                className="oauth-container btn darken-4 white black-text"
                onClick={kakaoSuccess}
              >
                <div className="inside__kakao">
                  <span>Start with Kakao</span>
                </div>
              </a>
            </div>
            <div className="line">
              <span>또는</span>
            </div> */}
            <KakaoLogin
              className="KaKaoLogin"
              onSuccess={kakaoSuccess}
              onFail={console.log}
              token={kakaoAppKey}
            >
              {/* <img src={kakaoImg} alt="kakao" />
                  카카오 3초만에 가입하기 */}
            </KakaoLogin>
            <input
              name="usermail"
              type="text"
              placeholder="이메일 주소"
              value={usermail}
              onChange={onChangeUsermailHandler}
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

            <input
              name="userid"
              type="text"
              placeholder="아이디"
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
              <div style={{ position: "relative" }}>
                <img
                  src={cancelImg}
                  style={{
                    position: "absolute",
                    width: "20px",
                    height: "20px",
                    top: "-34px",
                    right: "-139px",
                  }}
                />
              </div>
            )}
            {/* {idCheckIsOk && (
              <div style={{ position: "relative" }}>
                <img
                  src={okImg}
                  style={{
                    position: "absolute",
                    width: "20px",
                    height: "20px",
                    top: "-34px",
                    right: "-139px",
                  }}
                />
              </div>
            )} */}
            <input
              name="nickname"
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={onChangeNicknameHandler}
              onBlur={getNickNameData}
            />
            {nicknameError && (
              <div style={{ position: "relative" }}>
                <img
                  src={cancelImg}
                  style={{
                    position: "absolute",
                    width: "20px",
                    height: "20px",
                    top: "-34px",
                    right: "-139px",
                  }}
                />
              </div>
            )}
            {nicknameIsOk && (
              <div style={{ position: "relative" }}>
                <img
                  src={okImg}
                  style={{
                    position: "absolute",
                    width: "20px",
                    height: "20px",
                    top: "-34px",
                    right: "-139px",
                  }}
                />
              </div>
            )}
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
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
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
                가입
              </button>
            ) : (
              <button
                type="submit"
                className="selected"
                disabled
                onClick={onSubmit}
              >
                가입
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
