import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import Avatar from "avataaars";
import { Button, Space } from "antd";

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
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { faUser } from "@fortawesome/pro-solid-svg-icons/faUser";
import { faUserFriends } from "@fortawesome/pro-duotone-svg-icons/faUserFriends";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons/faUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserContext } from "../../context";

import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import Text from "../views/Text";

import StarterModal from "../modals/Starter";
import NotificationList from "../NotificationList";

import {
  capitolizeFirstChar,
  getUserBasicInfo,
  isPageActive,
  signOut,
  getTotalOnlineUsers
} from "../../util";
import {
  getNotifications,
  getUnreadConversations,
  howCompleteIsUserProfile,
  newNotificationCounter,
  readNotifications,
  resetUnreadConversationCount
} from "./util";

import "./style.css";

function Header({ history, location }) {
  const componentIsMounted = useRef(true);
  const { pathname, search } = location;

  const user = useContext(UserContext);

  const [starterModal, setStarterModal] = useState(false);
  const [mobileHeaderActive, setMobileHeaderActive] = useState(false);
  const [accountSectionActive, setAccountSectionActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showFeedback, setShowFeedback] = useState(true);
  const [missingAccountPercentage, setMissingAccountPercentage] = useState();
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

  let newNotificationsListenerUnsubscribe;
  let newConversationsListenerUnsubscribe;
  let onlineUsersUnsubscribe;

  useEffect(() => {
    if (newNotificationsListenerUnsubscribe)
      newNotificationsListenerUnsubscribe();
    if (newConversationsListenerUnsubscribe)
      newConversationsListenerUnsubscribe();
    if (onlineUsersUnsubscribe) onlineUsersUnsubscribe();

    onlineUsersUnsubscribe = getTotalOnlineUsers(totalOnlineUsers => {
      if (componentIsMounted.current) setTotalOnlineUsers(totalOnlineUsers);
    });
    if (user) {
      newConversationsListenerUnsubscribe = getUnreadConversations(
        componentIsMounted,
        pathname.substring(0, 7) === "/search",
        setUnreadConversationsCount,
        user.uid
      );
      getUserBasicInfo(newBasicUserInfo => {
        setUserBasicInfo(newBasicUserInfo);
        howCompleteIsUserProfile(setMissingAccountPercentage, newBasicUserInfo);
      }, user.uid);
      newNotificationsListenerUnsubscribe = getNotifications(
        componentIsMounted,
        setNotifications,
        user
      );
    }

    return () => {
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
      if (newConversationsListenerUnsubscribe)
        newConversationsListenerUnsubscribe();

      componentIsMounted.current = false;
    };
  }, [location, user]);

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
            src={require("../../svgs/icon.svg")}
            style={{ height: "50px" }}
          />
        </Link>
        <Container className="align-center">
          {user && (
            <Container className="align-center mr8">
              <Link to="/notifications">
                <FontAwesomeIcon
                  className="clickable blue"
                  icon={faBell}
                  onClick={() => {
                    setShowNotificationDropdown(!showNotificationDropdown);

                    readNotifications(notifications);
                  }}
                  size="2x"
                />
              </Link>

              {newNotificationCounter(notifications) &&
                !showNotificationDropdown && (
                  <Text
                    className="fs-14 bg-red white pa4 br8"
                    style={{
                      position: "absolute",
                      top: "-12px",
                      right: "-12px",
                      pointerEvents: "none",
                      zIndex: 1
                    }}
                    type="p"
                  >
                    {newNotificationCounter(notifications)}
                  </Text>
                )}
            </Container>
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
      {mobileHeaderActive && (
        <Space
          align="center"
          className="sidebar shadow-2 pa16"
          direction="vertical"
          onClick={() => setMobileHeaderActive(false)}
          size="large"
        >
          <Space align="center" className="bg-grey-4 py4 px8 br4">
            <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
            <input
              autoFocus={pathname.substring(0, 7) === "/search" ? true : false}
              className="no-border bg-grey-4 br4"
              onChange={e => {
                setVentSearchString(e.target.value);
                history.push("/search?" + e.target.value);
              }}
              placeholder="Search"
              type="text"
              value={ventSearchString}
            />
          </Space>
          {user && (
            <Space align="center" direction="vertical">
              <Space align="center" direction="vertical">
                <Space
                  align="center"
                  onClick={e => {
                    e.stopPropagation();
                    setAccountSectionActive(!accountSectionActive);
                  }}
                >
                  {user.displayName &&
                    (!userBasicInfo ||
                      (userBasicInfo && !userBasicInfo.avatar)) && (
                      <Text
                        className="round-icon bg-blue white mr8"
                        text={capitolizeFirstChar(user.displayName[0])}
                        type="h6"
                      />
                    )}
                  {userBasicInfo && userBasicInfo.avatar && (
                    <Avatar
                      avatarStyle={"Circle"}
                      topType={userBasicInfo.avatar.topType}
                      accessoriesType={userBasicInfo.avatar.accessoriesType}
                      hairColor={userBasicInfo.avatar.hairColor}
                      facialHairType={userBasicInfo.avatar.facialHairType}
                      clotheType={userBasicInfo.avatar.clotheType}
                      eyeType={userBasicInfo.avatar.eyeType}
                      eyebrowType={userBasicInfo.avatar.eyebrowType}
                      mouthType={userBasicInfo.avatar.mouthType}
                      skinColor={userBasicInfo.avatar.skinColor}
                      style={{ width: "48px", height: "48px" }}
                      className="mr8"
                    />
                  )}
                  <Text
                    className="mr8"
                    text={`Hello, ${capitolizeFirstChar(user.displayName)}`}
                    type="p"
                  />
                  <FontAwesomeIcon icon={faChevronDown} />
                </Space>
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
                      isPageActive("/settings", pathname)
                    }
                    to="/settings"
                  >
                    <FontAwesomeIcon className="mx8" icon={faCog} />
                    <p className="bold">Settings</p>
                  </Link>
                </Space>
              )}
            </Space>
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
          <h4 className="word-break tac mr16">
            Please verify your email address!
          </h4>
          <button
            className="button-2 no-bold py8 px16 my16 br8"
            onClick={() => user.sendEmailVerification()}
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

export default withRouter(Header);
