import React from "react";
import { Route, Switch } from "react-router";
import Chat from "./components/Chat";
import FindPassword from "./components/FindPassword";
import Header from "./components/Header";
import Home from "./components/Home";
import Join from "./components/Join";
import JoinEmail from "./components/JoinEmail";
import Login from "./components/Login";
import Main from "./components/Main";
import Notification from "./components/Notification";
import Profile from "./components/Profile";
import Recommend from "./components/Recommend";
import WriteModal from "./components/WriteModal";

const Router = () => {
  const isLogin = localStorage.getItem("username");
  return (
    <Switch>
      {isLogin !== "undefined" && isLogin ? (
        <>
          <Route exact path="/" component={Home} />
          <Route path="/WriteModal" component={WriteModal} />
          <Route path="/Chat" component={Chat} />
          <Route path="/Recommend" component={Recommend} />
          <Route path="/Notification" component={Notification} />
          <Route path="/Profile" component={Profile} />
        </>
      ) : (
        <>
          <Route exact path="/" component={Login} />
          <Route path="/Join" component={Join} />
          <Route path="/FindPassword" component={FindPassword} />
          <Route path="/JoinEmail" component={JoinEmail} />
        </>
      )}
    </Switch>
  );
};

export default Router;
