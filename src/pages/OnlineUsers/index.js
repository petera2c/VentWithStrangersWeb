import React, { useContext, useEffect, useState } from "react";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import UserComp from "../../components/User";

import { OnlineUsersContext } from "../../context";

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
      title="People Online"
    >
      <Container className="justify-center wrap pa16 gap16">
        {onlineUsers.map(({ lastOnline, userID }, index) => {
          return (
            <UserComp
              isOnline
              key={index}
              lastOnline={lastOnline}
              showMessageUser
              userID={userID}
            />
          );
        })}
      </Container>
    </Page>
  );
}

export default OnlineUsers;
