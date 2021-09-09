import React, { useState } from "react";
import { Route, Switch } from "react-router";
import FindPassword from "./components/FindPassword";
import Home from "./components/Home";
import Join from "./components/Join";
import JoinEmail from "./components/JoinEmail";
import Login from "./components/Login";
import Main from "./components/Main";
import WriteModal from "./components/WriteModal";

const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/Join" component={Join} />
      <Route path="/FindPassword" component={FindPassword} />
      <Route path="/JoinEmail" component={JoinEmail} />
      <Route path="/Home" component={Home} />
      <Route path="/Main" component={Main} />
      <Route path="/WriteModal" component={WriteModal} />
    </Switch>
  );
};

export default Router;
