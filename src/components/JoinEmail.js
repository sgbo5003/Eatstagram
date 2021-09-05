import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Footer from "./Footer";

const JoinEmail = () => {
  const [userData, setUserData] = useState({});
  const [inputData, setInputData] = useState("");
  const history = useHistory();
  // certificationNumber
  // emailAuthId

  const onChangeInputHandler = (e) => {
    setInputData(e.target.value);
  };
  const getData = () => {
    axios({
      method: "post",
      url: "join/step/two",
      data: {},
    })
      .then((response) => {
        console.log(response);
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sendData = () => {
    const params = new FormData();
    params.append("emailAuthId", userData.emailAuthId);
    axios({
      method: "post",
      url: "join/step/three",
      data: params,
    })
      .then((response) => {
        alert(response.data.msg);
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (inputData == userData.certificationNumber) {
      sendData();
    } else {
      alert("인증코드가 같지 않습니다.");
    }
  };

  const onResendData = (e) => {
    e.preventDefault();
    getData();
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div>
        <div id="form">
          <div className="form-logo__find">
            <h3>Eatstagram</h3>
            <h1>
              <i className="fas fa-envelope"></i>
            </h1>
            <h2>인증코드 입력</h2>
            <h4>이메일 주소로 전송된 코드를 입력하세요.</h4>
          </div>
          <form action="main.html" method="GET" id="mail-form">
            <div id="re-mail">
              <input type="submit" value="코드 재전송" onClick={onResendData} />
            </div>
            <input
              name="mailcode"
              type="text"
              placeholder="인증코드"
              value={inputData}
              onChange={onChangeInputHandler}
            />
            <input type="submit" value="다음" onClick={onSubmit} />
            <a>
              <h4>돌아가기</h4>
            </a>
          </form>
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

export default JoinEmail;
