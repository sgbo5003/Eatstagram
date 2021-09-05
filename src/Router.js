import React, { useState } from "react";
import { Route, Switch } from "react-router";
import FindPassword from "./components/FindPassword";
import Join from "./components/Join";
import JoinEmail from "./components/JoinEmail";
import Login from "./components/Login";
import Main from "./components/Main";

const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/Join" component={Join} />
      <Route path="/FindPassword" component={FindPassword} />
      <Route path="/JoinEmail" component={JoinEmail} />
      <Route path="/Main" component={Main} />
    </Switch>
  );
};

export default Router;
