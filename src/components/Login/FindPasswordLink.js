import React, { useEffect, useState } from "react";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import * as fnc from "../../commonFunc/CommonFunctions";
import { FaUserLock } from "react-icons/fa";
import profileDefaultImg from "../../../public/images/default_user.png";
import { useHistory } from "react-router";
const FindPasswordLink = () => {
  const paramsId = location.search.split("=")[1];
  const [confirmNewPwd, setConfirmNewPwd] = useState("");
  const [confirmNewPwdCheck, setConfirmNewPwdCheck] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [newPwdCheck, setNewPwdCheck] = useState(false);
  const [button, setButton] = useState(false);
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 양식 체크

  const sendNewPasswordData = () => {
    const history = useHistory();
    fnc.executeQuery({
      url: "changePasswordBeforeLoggingIn",
      data: {
        username: paramsId,
        newPassword: newPwd,
        newPasswordConfirm: confirmNewPwd,
      },
      success: (res) => {
        alert(res.msg);
        history.push("/");
      },
      fail: (res) => {
        alert(res.data.msg);
        setConfirmNewPwd("");
        setNewPwd("");
      },
      error: (res) => {
        alert(res.msg);
        setConfirmNewPwd("");
        setNewPwd("");
      },
    });
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

  // 새로운 비밀번호 제어
  const onNewPwdChange = (e) => {
    setNewPwd(e.target.value);
    setPasswordError(validatePassword(e.target.value));
    if (e.target.value === "" || e.target.value.trim() === "") {
      setNewPwdCheck(false);
    } else {
      setNewPwdCheck(true);
    }
  };
  // 새로운 비밀번호 확인 제어
  const onConfirmNewPwdChange = (e) => {
    setConfirmNewPwd(e.target.value);
    if (e.target.value === "" || e.target.value.trim() === "") {
      setConfirmNewPwdCheck(false);
    } else {
      setConfirmNewPwdCheck(true);
    }
  };

  const checkBtnOn = () => {
    if (confirmNewPwdCheck && newPwdCheck) {
      setButton(true);
    } else {
      setButton(false);
    }
  };

  const onSubmit = () => {
    if (passwordError) {
      alert("비밀번호 형식을 다시 확인해 주세요.");
    } else {
      sendNewPasswordData();
    }
  };

  useEffect(() => {
    checkBtnOn();
  });

  return (
    <div>
      <div id="form">
        <div class="form-logo__find">
          <h3>Eatstagram</h3>
          <h1>
            <FaUserLock />
          </h1>
          <h2>비밀 번호를 변경하세요</h2>
        </div>
        <div class="change-pw">
          <div class="change-pw-li">
            <aside>
              <label for="userid">새 비밀번호</label>
            </aside>
            <div class="change-pw-li__input">
              <input
                type="password"
                name="newPwd"
                value={newPwd}
                onChange={onNewPwdChange}
                placeholder="숫자, 영문, 특수문자 1개이상 을 포함한 8~20자를 입력해주세요."
              />
            </div>
          </div>
          <div class="change-pw-li">
            <aside>
              <label for="usertext">새 비밀번호 확인</label>
            </aside>
            <div class="change-pw-li__input">
              <input
                type="password"
                name="confirmNewPwd"
                value={confirmNewPwd}
                onChange={onConfirmNewPwdChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div class="change-pw__btn">
        {button ? (
          <button className="active" onClick={onSubmit}>
            비밀번호 변경
          </button>
        ) : (
          <button disabled="disabled">비밀번호 변경</button>
        )}
      </div>
    </div>
  );
};

export default FindPasswordLink;
