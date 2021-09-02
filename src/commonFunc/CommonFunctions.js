import axios from "axios";

export const executeQuery = ({
  url,
  data,
  currenturl,
  success,
  error,
  fail,
}) => {
  axios.defaults.baseURL = "https://api.on-startup.co.kr/";
  //   axios.defaults.headers = { "content-type": "multipart/form-data" };
  //   axios.defaults.withCredentials = true;

  const params = new FormData();
  Object.keys(data).map((element) => {
    params.append(element, data[element]);
  });
  params.append("currenturl", location.href);
  params.append("token", sessionStorage.getItem("token"));

  axios({
    method: "post",
    url,
    data: params || {},
  })
    .then((res) => {
      //   for (const keyValue of params) {
      //     console.log(keyValue);
      //   }
      if (res.data.response === "error") {
        if (error) {
          error(res.data);
          console.log("error1", res);
        } else if (res.data.msg === "이미 사용중인 E-mail 주소입니다.") {
          error(res.data);
          console.log(res);
        } else if (res.data.msg === "이미 로그인하셨습니다.") {
          console.log(res);
          success(res.data);
        } else {
          alert(res.data.msg);
          console.log("error2", res);
        }
      }
      if (res.data.response === "fail") {
        alert("서버접속에 실패하였습니다. 관리자에게 문의해주시기 바랍니다.");
        console.log("fail1", res);
        console.log(res.data);
      }
      if (res.data.response === "ok") {
        console.log(res);
        success(res.data);
      }
    })
    .catch((err) => {
      if (fail) {
        fail(err);
      } else {
        console.log("fail2", err);
        alert("서버접속에 실패하였습니다. 관리자에게 문의해주시기 바랍니다.");
      }
    });
};
