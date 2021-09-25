import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "../src/css/style.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
