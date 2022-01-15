import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Space } from "antd";
import { sendEmailVerification } from "firebase/auth";

import { faAnalytics } from "@fortawesome/pro-duotone-svg-icons/faAnalytics";
import { faBars } from "@fortawesome/pro-solid-svg-icons/faBars";
import { faBell } from "@fortawesome/pro-duotone-svg-icons/faBell";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons/faChevronDown";
import { faCog } from "@fortawesome/pro-solid-svg-icons/faCog";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faConciergeBell } from "@fortawesome/pro-duotone-svg-icons/faConciergeBell";
import { faInfo } from "@fortawesome/pro-duotone-svg-icons/faInfo";
import { faSearch } from "@fortawesome/pro-solid-svg-icons/faSearch";
import { faUser } from "@fortawesome/pro-solid-svg-icons/faUser";
import { faUserAstronaut } from "@fortawesome/pro-duotone-svg-icons/faUserAstronaut";
import { faUserFriends } from "@fortawesome/pro-duotone-svg-icons/faUserFriends";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons/faUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserContext } from "../../context";

import Container from "../containers/Container";
import MakeAvatar from "../MakeAvatar";
import StarterModal from "../modals/Starter";
import Text from "../views/Text";

import {
  capitolizeFirstChar,
  getUserBasicInfo,
  isPageActive,
  signOut,
  getTotalOnlineUsers,
  useIsMounted,
} from "../../util";
import {
  getNotifications,
  getUnreadConversations,
  newNotificationCounter,
  readNotifications,
  resetUnreadConversationCount,
} from "./util";

import "./style.css";

function Header() {
  const isMounted = useIsMounted();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;

  const { user } = useContext(UserContext);

  const [starterModal, setStarterModal] = useState(false);
  const [mobileHeaderActive, setMobileHeaderActive] = useState(false);
  const [accountSectionActive, setAccountSectionActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(
    false
  );
  const [unreadConversationsCount, setUnreadConversationsCount] = useState();
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [totalOnlineUsers, setTotalOnlineUsers] = useState(0);

  const [ventSearchString, setVentSearchString] = useState(
    pathname.substring(0, 7) === "/search"
      ? search.substring(1, search.length)
      : ""
  );

  useEffect(() => {
    let newNotificationsListenerUnsubscribe;
    let newConversationsListenerUnsubscribe;
    let onlineUsersUnsubscribe;

    onlineUsersUnsubscribe = getTotalOnlineUsers((totalOnlineUsers) => {
      if (isMounted()) setTotalOnlineUsers(totalOnlineUsers);
    });

    if (user) {
      newConversationsListenerUnsubscribe = getUnreadConversations(
        isMounted,
        pathname.substring(0, 7) === "/search",
        setUnreadConversationsCount,
        user.uid
      );
      getUserBasicInfo((newBasicUserInfo) => {
        setUserBasicInfo(newBasicUserInfo);
      }, user.uid);
      newNotificationsListenerUnsubscribe = getNotifications(
        isMounted,
        setNotifications,
        user
      );
    }

    return () => {
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
      if (newConversationsListenerUnsubscribe)
        newConversationsListenerUnsubscribe();
      if (onlineUsersUnsubscribe) onlineUsersUnsubscribe.off("value");
    };
  }, [isMounted, pathname, user]);

  if (pathname === "/conversations" && user && unreadConversationsCount > 0)
    resetUnreadConversationCount(user.uid);

  return (
    <Container
      className="sticky top-0 relative column x-fill full-center bg-white border-top large active shadow-2"
      style={{ zIndex: 10 }}
    >
      <Container className="x-fill align-center justify-between border-bottom py8 px16">
        <Link to="/">
          <img
            alt=""
            className="clickable"
            src="/svgs/icon.svg"
            style={{ height: "50px" }}
          />
        </Link>
        <Container>
          {user && (
            <Link className="relative mr16" to="/notifications">
              <FontAwesomeIcon
                className="clickable blue"
                icon={faBell}
                onClick={() => {
                  setShowNotificationDropdown(!showNotificationDropdown);

                  readNotifications(notifications);
                }}
                size="2x"
              />
              {newNotificationCounter(notifications) &&
                !showNotificationDropdown && (
                  <Text
                    className="fs-14 bg-red white pa4 br8"
                    style={{
                      position: "absolute",
                      top: "-12px",
                      right: "-12px",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                    type="p"
                  >
                    {newNotificationCounter(notifications)}
                  </Text>
                )}
            </Link>
          )}

          <Container className="full-center border-all active pa8 br4">
            <FontAwesomeIcon
              className="blue"
              icon={faBars}
              onClick={() => setMobileHeaderActive(!mobileHeaderActive)}
            />
          </Container>
        </Container>
      </Container>
      {(mobileHeaderActive || pathname.substring(0, 7) === "/search") && (
        <Space align="center" className="bg-grey-4 py4 px8 my8 br4">
          <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
          <input
            autoFocus={pathname.substring(0, 7) === "/search" ? true : false}
            className="no-border bg-grey-4 br4"
            onChange={(e) => {
              setVentSearchString(e.target.value);
              navigate("/search?" + e.target.value);
            }}
            placeholder="Search"
            type="text"
            value={ventSearchString}
          />
        </Space>
      )}
      {mobileHeaderActive && (
        <Space
          align="center"
          className="sidebar shadow-2 pa16"
          direction="vertical"
          onClick={() => setMobileHeaderActive(false)}
          size="large"
        >
          {user && (
            <Container className="align-center column">
              <Space
                align="center"
                onClick={(e) => {
                  e.stopPropagation();
                  setAccountSectionActive(!accountSectionActive);
                }}
              >
                <MakeAvatar
                  displayName={user.displayName}
                  userBasicInfo={userBasicInfo}
                />

                <Text
                  className="mr8"
                  text={`Hello, ${capitolizeFirstChar(user.displayName)}`}
                  type="p"
                />
                <FontAwesomeIcon icon={faChevronDown} />
              </Space>
              {accountSectionActive && (
                <Space align="center" direction="vertical" size="middle">
                  <p
                    className="tac fs-14"
                    onClick={() => signOut(user.uid)}
                    type="link"
                  >
                    Sign Out
                  </p>
                  <Link
                    className={
                      "flex full-center button-3 " +
                      isPageActive("/profile", pathname)
                    }
                    to="/profile"
                  >
                    <FontAwesomeIcon className="mx8" icon={faChartNetwork} />
                    <p className="bold">Profile</p>
                  </Link>

                  <Link
                    className={
                      "flex full-center button-3 " +
                      isPageActive("/account", pathname)
                    }
                    to="/account"
                  >
                    <FontAwesomeIcon className="mx8" icon={faUser} />
                    <p className="bold">Account</p>
                  </Link>
                  <Link
                    className={
                      "flex full-center button-3 " +
                      isPageActive("/avatar", pathname)
                    }
                    to="/avatar"
                  >
                    <FontAwesomeIcon className="mx8" icon={faUserAstronaut} />
                    <p className="bold">Avatar</p>
                  </Link>

                  <Link
                    className={
                      "flex full-center button-3 " +
                      isPageActive("/settings", pathname)
                    }
                    to="/settings"
                  >
                    <FontAwesomeIcon className="mx8" icon={faCog} />
                    <p className="bold">Settings</p>
                  </Link>
                </Space>
              )}
            </Container>
          )}

          <Space align="center" direction="vertical" size="middle">
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/trending", pathname) +
                isPageActive("/", pathname)
              }
              to="/trending"
            >
              <FontAwesomeIcon className="mr8" icon={faAnalytics} />
              <p className="bold">Trending</p>
            </Link>
            <Link
              className={
                "flex full-center button-3" + isPageActive("/recent", pathname)
              }
              to="/recent"
            >
              <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
              <p className="bold">Recent</p>
            </Link>
            <Link
              className={
                "button-3 flex full-center relative " +
                isPageActive("/conversations", pathname)
              }
              to="/conversations"
            >
              <FontAwesomeIcon className="mr8" icon={faComments} />
              <p className="bold">Inbox</p>

              {Boolean(unreadConversationsCount) && (
                <p className="fs-14 bg-red white round ml4 pa4 br4">
                  {unreadConversationsCount}
                </p>
              )}
            </Link>
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/site-info", pathname)
              }
              to="/site-info"
            >
              <FontAwesomeIcon className="mr8" icon={faInfo} />
              <p className="bold">Site Info</p>
            </Link>
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/make-friends", pathname)
              }
              to="/make-friends"
            >
              <FontAwesomeIcon className="mr8" icon={faUsers} />
              <p className="bold">Make Friends</p>
            </Link>

            <Link
              className={
                "flex full-center button-3" +
                isPageActive("/vent-to-strangers", pathname)
              }
              to="/vent-to-strangers"
            >
              <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
              <p className="bold">Post a Vent</p>
            </Link>
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/online-users", pathname)
              }
              to="/online-users"
            >
              <FontAwesomeIcon className="mr8" icon={faUserFriends} />
              <p className="bold">
                {totalOnlineUsers}{" "}
                {totalOnlineUsers === 1 ? "Person" : "People"} Online
              </p>
            </Link>
          </Space>
          {!user && (
            <Space>
              <Button onClick={() => setStarterModal("login")}>Login</Button>

              <Button onClick={() => setStarterModal("signUp")} type="primary">
                Sign Up
              </Button>
            </Space>
          )}
        </Space>
      )}
      {user && !user.emailVerified && (
        <Container className="x-fill full-center bg-grey-2">
          <h4 className="tac mr16">Please verify your email address!</h4>
          <button
            className="button-2 no-bold py8 px16 my16 br8"
            onClick={() => sendEmailVerification(user)}
          >
            Re-send verification link
          </button>
        </Container>
      )}
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Container>
  );
}

export default Header;
