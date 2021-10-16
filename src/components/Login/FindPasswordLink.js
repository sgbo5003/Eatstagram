import React, { useEffect, useState } from "react";
import * as fncObj from "../../commonFunc/CommonObjFunctions";
import * as fnc from "../../commonFunc/CommonFunctions";
import profileDefaultImg from "../../../public/images/default_user.png";
const FindPasswordLink = () => {
  const [confirmNewPwd, setConfirmNewPwd] = useState("");
  const [confirmNewPwdCheck, setConfirmNewPwdCheck] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [newPwdCheck, setNewPwdCheck] = useState(false);
  const [button, setButton] = useState(false);
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 양식 체크

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

  useEffect(() => {
    checkBtnOn();
  });

  return (
    <>
      <div className="edit-right-li">
        <aside>
          <img src="" alt="" />
        </aside>
        <div className="edit-right-li__input">
          <h1>hi</h1>
        </div>
      </div>

      <div className="edit-right-li">
        <aside>
          <label htmlFor="userid">새 비밀번호</label>
        </aside>
        <div className="edit-right-li__input">
          <input
            type="password"
            name="newPwd"
            value={newPwd}
            onChange={onNewPwdChange}
            placeholder="숫자, 영문, 특수문자 1개이상 을 포함한 8~20자를 입력해주세요."
          />
        </div>
      </div>
      <div className="edit-right-li">
        <aside>
          <label htmlFor="usertext">새 비밀번호 확인</label>
        </aside>
        <div className="edit-right-li__input">
          <input
            type="password"
            name="confirmNewPwd"
            value={confirmNewPwd}
            onChange={onConfirmNewPwdChange}
          />
        </div>
      </div>
      <div className="edit-right-li edit-btn">
        <aside></aside>
        <div className="edit-right-li__btn">
          {button ? (
            <button className="active">비밀번호 변경</button>
          ) : (
            <button disabled="disabled">비밀번호 변경</button>
          )}
        </div>
      </div>
    </>
  );
};

export default FindPasswordLink;
