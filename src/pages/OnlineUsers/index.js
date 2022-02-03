import React, { useContext, useEffect, useRef, useState } from "react";
import loadable from "@loadable/component";

import { OnlineUsersContext } from "../../context";

import { useIsMounted } from "../../util";
import { getOnlineUsers } from "./util";

const Container = loadable(() =>
  import("../../components/containers/Container")
);
const Page = loadable(() => import("../../components/containers/Page"));
const UserComp = loadable(() => import("../../components/User"));

function OnlineUsers() {
  const isMounted = useIsMounted();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { totalOnlineUsers } = useContext(OnlineUsersContext);

  useEffect(() => {
    getOnlineUsers(isMounted, setOnlineUsers, totalOnlineUsers);

    
  }, [isMounted, setOnlineUsers, totalOnlineUsers]);

  return (
    <Page className="column align-center bg-grey-2">
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
