import React, { useState } from "react";
import { Route, Switch } from "react-router";
import FindPassword from "./components/FindPassword";
import Join from "./components/Join";
import Login from "./components/Login";

const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/Join" component={Join} />
      <Route path="/FindPassword" component={FindPassword} />
    </Switch>
  );
};

export default Router;
