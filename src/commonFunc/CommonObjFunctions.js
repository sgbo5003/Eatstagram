import axios from "axios";

export const executeQuery = ({ url, data, success, error, fail }) => {
  axios.defaults.baseURL = "http://localhost:8080/";

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
      success(res.data);
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
