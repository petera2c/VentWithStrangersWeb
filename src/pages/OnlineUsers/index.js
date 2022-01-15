import React, { useContext, useEffect, useState } from "react";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import UserComp from "../../components/User";

import { OnlineUsersContext } from "../../context";

import { isMobileOrTablet } from "../../util";
import { getOnlineUsers } from "./util";

function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { totalOnlineUsers } = useContext(OnlineUsersContext);

  useEffect(() => {
    getOnlineUsers(setOnlineUsers, totalOnlineUsers);
  }, [totalOnlineUsers]);

  return (
    <Page
      className="column align-center bg-grey-2"
      description="Current people online."
      keywords=""
      title="People online"
    >
      <h1 className="grey-1 tac fw-600 mt32 mb16">People Online</h1>
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
