import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router";
import Chat from "./components/Chat/Chat";
import FindPassword from "./components/Login/FindPassword";
import Header from "./components/Header";
import Home from "./components/Home/Home";
import Join from "./components/Join/Join";
import JoinEmail from "./components/Join/JoinEmail";
import Login from "./components/Login/Login";
import Notification from "./components/Notification";
import Profile from "./components/Profile/Profile";
import Recommend from "./components/Recommend";

const Router = () => {
  const isLogin = localStorage.getItem("username");
  const history = useHistory();

  useEffect(() => {
    if (isLogin !== "undefined" && isLogin) {
      return;
    } else {
      history.push("/");
    }
  }, []);
  return (
    <Switch>
      {isLogin !== "undefined" && isLogin ? (
        <>
          <Header />
          <Route exact path="/" component={Home} />
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
