import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AdSense from "react-adsense";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import UserComp from "../../components/User";

import { getTotalOnlineUsers, isMobileOrTablet } from "../../util";
import { getOnlineUsers } from "./util";
import { UserContext } from "../../context";

function OnlineUsers() {
  const componentIsMounted = useRef(true);
  const user = useContext(UserContext);
  const [onlineUsers, setOnlineUsers] = useState([]);

  let onlineUsersUnsubscribe;

  useEffect(() => {
    onlineUsersUnsubscribe = getTotalOnlineUsers(totalOnlineUsers =>
      getOnlineUsers(setOnlineUsers, totalOnlineUsers)
    );

    return () => {
      componentIsMounted.current = false;
      if (onlineUsersUnsubscribe) onlineUsersUnsubscribe.off("value");
    };
  }, [location]);

  return (
    <Page
      className="column align-center bg-grey-2"
      description="Current online users."
      keywords=""
      title="Online Users"
    >
      <h1 className="grey-1 tac fw-600 mt32 mb16">Online Users</h1>
      <Container
        className={
          "wrap justify-center pa16 gap16 " +
          (isMobileOrTablet()
            ? "container mobile-full px16"
            : "container extra-large")
        }
      >
        {onlineUsers.map((userID, index) => {
          return (
            <UserComp isOnline key={index} showMessageUser userID={userID} />
          );
        })}
      </Container>
    </Page>
  );
}

export default OnlineUsers;
