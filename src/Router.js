import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router";
import Chat from "./components/Chat/Chat";
import FindPassword from "./components/Login/FindPassword";
import Header from "./components/Header";
import Home from "./components/Home/Home";
import Join from "./components/Join/Join";
import JoinEmail from "./components/Join/JoinEmail";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import Recommend from "./components/Recommend";
import ProfileEdit from "./components/Profile/ProfileEdit";
import Ranking from "./components/Home/Ranking";
import SearchResult from "./components/Search/SearchResult";
import FindPasswordLink from "./components/Login/FindPasswordLink";

const Router = () => {
  const isLogin = localStorage.getItem("username");
  const history = useHistory();
  const [messageCount, setMessageCount] = useState(0); // 채팅 알림
  const uploadPath = "upload/";
  const profileFilePath = uploadPath + "profile/";
  const contentFilePath = uploadPath + "content/";
  const dmFilePath = uploadPath + "dm/";

  //   useEffect(() => {
  //     if (isLogin !== "undefined" && isLogin) {
  //       return;
  //     } else {
  //       history.push("/");
  //     }
  //   }, []);
  return (
    <Switch>
      {isLogin !== "undefined" && isLogin ? (
        <>
          <Header
            messageCount={messageCount}
            setMessageCount={setMessageCount}
          />
          <Route exact path="/" component={Home} />
          <Route
            path="/Chat"
            render={() => (
              <Chat
                messageCount={messageCount}
                setMessageCount={setMessageCount}
              />
            )}
          />
          <Route path="/Recommend" component={Recommend} />

          <Route path="/Profile" component={Profile} />
          <Route path="/ProfileEdit" component={ProfileEdit} />
          <Route path="/Ranking" component={Ranking} />
          <Route path="/SearchResult" component={SearchResult} />
        </>
      ) : (
        <>
          <Route exact path="/" component={Login} />
          <Route path="/Join" component={Join} />
          <Route path="/FindPassword" component={FindPassword} />
          <Route path="/JoinEmail" component={JoinEmail} />
          <Route path="/FindPasswordLink" component={FindPasswordLink} />
        </>
      )}
    </Switch>
  );
};

export default Router;
