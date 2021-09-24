import axios from "axios";

export const executeQuery = ({ url, data, success, error, fail }) => {
  axios.defaults.baseURL = "http://www.whereyedo:8080";
  axios.defaults.withCredentials = true;

  const params = new FormData();
  Object.keys(data).map((element) => {
    params.append(element, data[element]);
  });

  axios({
    method: "post",
    url,
    data: params || {},
  })
    .then((res) => {
      console.log(res);
      if (res.data.response === "error") {
        if (error) {
          error(res.data);
          console.log("error1", res);
        } else {
          alert(res.data.msg);
          console.log("error2", res);
        }
      }
      if (res.data.response === "fail") {
        // alert("서버접속에 실패하였습니다. 관리자에게 문의해주시기 바랍니다.");
        fail(res);
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
        console.log("fail3", err);
      } else {
        console.log("fail2", err);
        alert("서버접속에 실패하였습니다. 관리자에게 문의해주시기 바랍니다.");
      }
    });
};
