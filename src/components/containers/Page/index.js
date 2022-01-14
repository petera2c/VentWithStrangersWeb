import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
import { Space } from "antd";

import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faUserAstronaut } from "@fortawesome/pro-duotone-svg-icons/faUserAstronaut";

import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faInfo } from "@fortawesome/pro-duotone-svg-icons/faInfo";
import { faPen } from "@fortawesome/pro-duotone-svg-icons/faPen";
import { faUserFriends } from "@fortawesome/pro-duotone-svg-icons/faUserFriends";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons/faUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../Container";
import Header from "../../Header";
import MakeAd from "../../MakeAd";
import MobileHeader from "../../Header/MobileHeader";

import { UserContext } from "../../../context";

import {
  getTotalOnlineUsers,
  isMobileOrTablet,
  isPageActive,
  signOut,
  useIsMounted,
} from "../../../util";

import "./style.css";

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
        <Container className="flex x-fill full-center">
          <FontAwesomeIcon icon={icon} />
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
          <FontAwesomeIcon icon={icon} />
        </Container>
        <h5 className="grey-1 inherit-color">{text}</h5>
      </Container>
    );
}

function Page(props) {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);

  const { children, className, testMode } = props;
  const { pathname, search } = useLocation();
  const [totalOnlineUsers, setTotalOnlineUsers] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      ReactGA.initialize("UA-140815372-2");
      ReactGA.pageview(pathname);
    }
    window.scrollTo(0, 0);
    let onlineUsersUnsubscribe;

    onlineUsersUnsubscribe = getTotalOnlineUsers((totalOnlineUsers) => {
      if (isMounted()) setTotalOnlineUsers(totalOnlineUsers);
    });

    return () => {
      if (onlineUsersUnsubscribe) onlineUsersUnsubscribe.off("value");
    };
  }, [pathname]);

  const checkPropsVariables = (activePage) => {
    let { title, description, image, style } = props; // Variables
    title += " | Vent With Strangers";
    return { style, title, description, image };
  };

  const { description, image, style, title } = checkPropsVariables(pathname);

  return (
    <Container
      className="screen-container column ov-hidden"
      testMode={testMode}
    >
      <Helmet defer={false}>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="og:title" content={title} />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta property="image" content={image} />
        <meta property="og:image" content={image} />
      </Helmet>

      {!isMobileOrTablet() && <Header />}
      {isMobileOrTablet() && <MobileHeader />}

      <Container className="flex-fill x-fill ov-hidden">
        {!isMobileOrTablet() && (
          <Space
            className="column ov-auto bg-white border-top pa16"
            direction="vertical"
          >
            <SideBarLink
              icon={faUserFriends}
              link="/online-users"
              pathname={pathname}
              text={
                totalOnlineUsers +
                " " +
                (totalOnlineUsers === 1 ? "Person" : "People") +
                " Online"
              }
            />
            <SideBarLink
              icon={faPen}
              link="/vent-to-strangers"
              pathname={pathname}
              text="Post a Vent"
            />
            {user && (
              <SideBarLink
                icon={faComments}
                link="/conversations"
                pathname={pathname}
                text="Inbox"
              />
            )}
            <SideBarLink
              icon={faUsers}
              link="/make-friends"
              pathname={pathname}
              text="Make Friends"
            />

            <MakeAd className="mt16" slot="4732645487" />

            {user && (
              <SideBarLink
                icon={faChartNetwork}
                link="/profile"
                pathname={pathname}
                text="My Public Profile"
              />
            )}
            {user && (
              <SideBarLink
                icon={faUser}
                link="/account"
                pathname={pathname}
                text="Account"
              />
            )}
            {user && (
              <SideBarLink
                icon={faUserAstronaut}
                link="/avatar"
                pathname={pathname}
                text="Avatar"
              />
            )}
            {user && (
              <SideBarLink
                icon={faCog}
                link="/settings"
                pathname={pathname}
                text="Notifications / Settings"
              />
            )}
            <SideBarLink
              icon={faInfo}
              link="/site-info"
              pathname={pathname}
              text="Site Info"
            />
            {user && (
              <SideBarLink
                icon={faCog}
                onClick={() => {
                  signOut(user.uid);
                }}
                pathname={pathname}
                text="Sign Out"
              />
            )}
          </Space>
        )}
        <Container
          className={"column flex-fill ov-auto bg-grey-2 " + className}
          style={style}
        >
          {children}
        </Container>
      </Container>
    </Container>
  );
}

export default Page;
