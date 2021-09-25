import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "../src/css/style.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// axios.defaults.baseURL = "http://www.whereyedo:8080";
// axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
