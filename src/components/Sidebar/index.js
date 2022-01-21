import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Space } from "antd";

import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faInfo } from "@fortawesome/pro-duotone-svg-icons/faInfo";
import { faPrayingHands } from "@fortawesome/pro-duotone-svg-icons/faPrayingHands";
import { faStarShooting } from "@fortawesome/pro-duotone-svg-icons/faStarShooting";
import { faUserFriends } from "@fortawesome/pro-duotone-svg-icons/faUserFriends";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons/faUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../containers/Container";
import MakeAd from "../MakeAd";

import { OnlineUsersContext, UserContext } from "../../context";

import { getTotalOnlineUsers, isPageActive, useIsMounted } from "../../util";
import { getUserAvatars } from "./util";

function SideBarLink({ icon, link, onClick, pathname, text }) {
  if (link)
    return (
      <Link
        className={
          "x-fill align-center grid-1 button-4 clickable py8 " +
          isPageActive(link, pathname)
        }
        to={link}
      >
        <Container className="flex blue x-fill full-center">
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.25rem" }} />
        </Container>
        <h5 className="grey-1 inherit-color">{text}</h5>
      </Link>
    );

  if (onClick)
    return (
      <Container
        className="x-fill align-center grid-1 button-4 clickable py8"
        onClick={onClick}
      >
        <Container className="flex x-fill full-center">
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.25rem" }} />
        </Container>
        <h5 className="grey-1 inherit-color">{text}</h5>
      </Container>
    );
}

function Sidebar() {
  const isMounted = useIsMounted();
  const { pathname } = useLocation();

  const { userSubscription } = useContext(UserContext);

  const { totalOnlineUsers, setTotalOnlineUsers } = useContext(
    OnlineUsersContext
  );

  useEffect(() => {
    let onlineUsersUnsubscribe;

    onlineUsersUnsubscribe = getTotalOnlineUsers((totalOnlineUsers) => {
      if (isMounted()) {
        //getUserAvatars(totalOnlineUsers);
        setTotalOnlineUsers(totalOnlineUsers);
      }
    });

    return () => {
      if (onlineUsersUnsubscribe) onlineUsersUnsubscribe.off("value");
    };
  }, [isMounted, setTotalOnlineUsers]);

  return (
    <Space
      className="container ad column ov-auto bg-white border-top pa16"
      direction="vertical"
    >
      <SideBarLink
        icon={faUserFriends}
        link="/online-users"
        pathname={pathname}
        text={
          (totalOnlineUsers ? totalOnlineUsers : "0") +
          (totalOnlineUsers === 1 ? " Person" : " People") +
          " Online"
        }
      />
      <SideBarLink
        icon={faComments}
        link="/chat-with-strangers"
        pathname={pathname}
        text="Chat With Strangers"
      />
      <SideBarLink
        icon={faStarShooting}
        link="/rewards"
        pathname={pathname}
        text="Rewards"
      />
      <SideBarLink
        icon={faPrayingHands}
        link="/rules"
        pathname={pathname}
        text="Rules"
      />
      <SideBarLink
        icon={faInfo}
        link="/site-info"
        pathname={pathname}
        text="VWS Info"
      />
      <SideBarLink
        icon={faUsers}
        link="/make-friends"
        pathname={pathname}
        text="Make Friends"
      />
      <MakeAd
        className="mt16"
        slot="4732645487"
        userSubscription={userSubscription}
      />
    </Space>
  );
}

export default Sidebar;
