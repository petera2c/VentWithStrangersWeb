import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import UserComp from "../../components/User";

import { OnlineUsersContext } from "../../context";
import { useIsMounted } from "../../util";
import { getOnlineUsers } from "./util";

const FETCH_USER_INIT_COUNT = 6;

function OnlineUsers() {
  const isMounted = useIsMounted();

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userLoadCount, setUserLoadCount] = useState(FETCH_USER_INIT_COUNT);

  const { totalOnlineUsers } = useContext(OnlineUsersContext);

  useEffect(() => {
    //  getOnlineUsers(isMounted, setOnlineUsers, userLoadCount);
  }, [isMounted, setOnlineUsers, totalOnlineUsers, userLoadCount]);

  return (
    <Page className="column align-center bg-grey-2 gap16 pa16">
      <Container className="justify-center wrap  gap16">
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
      {totalOnlineUsers > onlineUsers.length && (
        <Button
          onClick={() =>
            setUserLoadCount(
              (userLoadCount) => userLoadCount + FETCH_USER_INIT_COUNT
            )
          }
          size="large"
          type="primary"
        >
          Load More Users
        </Button>
      )}
    </Page>
  );
}

export default OnlineUsers;
