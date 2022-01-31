import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Space } from "antd";

import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faInfo } from "@fortawesome/pro-duotone-svg-icons/faInfo";
import { faPrayingHands } from "@fortawesome/pro-duotone-svg-icons/faPrayingHands";
import { faQuoteLeft } from "@fortawesome/pro-duotone-svg-icons/faQuoteLeft";
import { faStarShooting } from "@fortawesome/pro-duotone-svg-icons/faStarShooting";
import { faUserFriends } from "@fortawesome/pro-duotone-svg-icons/faUserFriends";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons/faUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../containers/Container";
import MakeAd from "../MakeAd";
import MakeAvatar from "../MakeAvatar";

import { OnlineUsersContext, UserContext } from "../../context";

import {
  chatQueueEmptyListener,
  getTotalOnlineUsers,
  isPageActive,
  useIsMounted,
} from "../../util";
import { getUserAvatars } from "./util";

function Sidebar() {
  const isMounted = useIsMounted();
  const { pathname } = useLocation();

  const { userSubscription } = useContext(UserContext);
  const { totalOnlineUsers, setTotalOnlineUsers } = useContext(
    OnlineUsersContext
  );

  const [firstOnlineUsers, setFirstOnlineUsers] = useState();
  const [queueLength, setQueueLength] = useState(true);

  useEffect(() => {
    let onlineUsersUnsubscribe;
    let chatQueueListenerUnsubscribe;

    chatQueueListenerUnsubscribe = chatQueueEmptyListener(
      isMounted,
      setQueueLength
    );
    onlineUsersUnsubscribe = getTotalOnlineUsers((totalOnlineUsers) => {
      if (isMounted()) {
        getUserAvatars(setFirstOnlineUsers, totalOnlineUsers);
        setTotalOnlineUsers(totalOnlineUsers);
      }
    });

    return () => {
      if (onlineUsersUnsubscribe) onlineUsersUnsubscribe.off("value");
      if (chatQueueListenerUnsubscribe) chatQueueListenerUnsubscribe();
    };
  }, [isMounted, setTotalOnlineUsers]);

  return (
    <Space
      className="container ad column ov-auto bg-white border-top pt8 px16 pb16"
      direction="vertical"
    >
      <SideBarLink
        icon={faUserFriends}
        link="/people-online"
        pathname={pathname}
        firstOnlineUsers={firstOnlineUsers}
        text={
          (totalOnlineUsers ? totalOnlineUsers : "0") +
          (totalOnlineUsers === 1 ? " Person" : " People") +
          " Online"
        }
        totalOnlineUsers={totalOnlineUsers}
      />
      <SideBarLink
        icon={faComments}
        link="/chat-with-strangers"
        pathname={pathname}
        text={
          "Chat With Strangers" +
          (queueLength === -1 ? "" : ` (${queueLength})`)
        }
      />
      <SideBarLink
        icon={faQuoteLeft}
        link="/quote-contest"
        pathname={pathname}
        text="Daily Quote Contest"
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

function SideBarLink({
  icon,
  link,
  onClick,
  pathname,
  firstOnlineUsers,
  text,
  totalOnlineUsers,
}) {
  if (link)
    return (
      <Link
        className={
          "align-center button-4 clickable py8 " +
          isPageActive(link, pathname) +
          (firstOnlineUsers ? " grid-2" : " grid-1")
        }
        to={link}
      >
        <Container className="blue x-fill full-center">
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.25rem" }} />
        </Container>
        <h5 className="ic">{text}</h5>
        {firstOnlineUsers && (
          <Container className="flex-fill align-end">
            {firstOnlineUsers.map((userBasicInfo, index) => (
              <Container
                className="relative avatar small"
                key={userBasicInfo.id}
              >
                <Container
                  className="absolute"
                  style={{ left: `-${index * 24}px` }}
                >
                  <MakeAvatar
                    displayName={userBasicInfo.displayName}
                    userBasicInfo={userBasicInfo}
                    size="small"
                  />
                </Container>
              </Container>
            ))}
            {totalOnlineUsers - firstOnlineUsers.length > 0 && (
              <Container className="relative avatar very-small">
                <Container
                  className="absolute avatar very-small bg-grey-2"
                  style={{ left: `-${firstOnlineUsers.length * 24}px`, top: 0 }}
                >
                  <div className="avatar small blue">
                    +{totalOnlineUsers - firstOnlineUsers.length}
                  </div>
                </Container>
              </Container>
            )}
          </Container>
        )}
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
        <h5 className="grey-1 ic">{text}</h5>
      </Container>
    );
}

export default Sidebar;
