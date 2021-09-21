import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "../src/css/style.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// axios.defaults.baseURL = "http://localhost:8080/";
axios.defaults.baseURL =
  "http://ec2-3-36-133-3.ap-northeast-2.compute.amazonaws.com:8080/";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
