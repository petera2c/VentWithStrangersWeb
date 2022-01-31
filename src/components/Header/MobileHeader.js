import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { sendEmailVerification } from "firebase/auth";
import { Button, message, Space } from "antd";

import { faAnalytics } from "@fortawesome/pro-duotone-svg-icons/faAnalytics";
import { faBars } from "@fortawesome/pro-duotone-svg-icons/faBars";
import { faBell } from "@fortawesome/pro-duotone-svg-icons/faBell";
import { faChartNetwork } from "@fortawesome/pro-duotone-svg-icons/faChartNetwork";
import { faChevronDown } from "@fortawesome/pro-duotone-svg-icons/faChevronDown";
import { faCog } from "@fortawesome/pro-duotone-svg-icons/faCog";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faConciergeBell } from "@fortawesome/pro-duotone-svg-icons/faConciergeBell";
import { faInfo } from "@fortawesome/pro-duotone-svg-icons/faInfo";
import { faQuoteLeft } from "@fortawesome/pro-duotone-svg-icons/faQuoteLeft";
import { faSearch } from "@fortawesome/pro-duotone-svg-icons/faSearch";
import { faStarShooting } from "@fortawesome/pro-duotone-svg-icons/faStarShooting";
import { faUser } from "@fortawesome/pro-duotone-svg-icons/faUser";
import { faUserAstronaut } from "@fortawesome/pro-duotone-svg-icons/faUserAstronaut";
import { faUserFriends } from "@fortawesome/pro-duotone-svg-icons/faUserFriends";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons/faUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserContext, OnlineUsersContext } from "../../context";

import Container from "../containers/Container";
import MakeAvatar from "../MakeAvatar";
import StarterModal from "../modals/Starter";
import Text from "../views/Text";

import {
  capitolizeFirstChar,
  isPageActive,
  signOut,
  getTotalOnlineUsers,
  useIsMounted,
} from "../../util";
import {
  conversationsListener,
  getNotifications,
  getUnreadConversations,
  isUserInQueueListener,
  leaveQueue,
  newNotificationCounter,
  readNotifications,
  resetUnreadConversationCount,
} from "./util";

function Header() {
  const isMounted = useIsMounted();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;

  const { totalOnlineUsers, setTotalOnlineUsers } = useContext(
    OnlineUsersContext
  );
  const { user, userBasicInfo } = useContext(UserContext);

  const [accountSectionActive, setAccountSectionActive] = useState(false);
  const [isUserInQueue, setIsUserInQueue, isUserInQueueRef] = useState();
  const [mobileHeaderActive, setMobileHeaderActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(
    false
  );
  const [starterModal, setStarterModal] = useState(false);
  const [unreadConversationsCount, setUnreadConversationsCount] = useState();

  const [ventSearchString, setVentSearchString] = useState(
    pathname.substring(0, 7) === "/search"
      ? search.substring(1, search.length)
      : ""
  );

  useEffect(() => {
    let conversationsUnsubscribe;
    let isUserInQueueUnsubscribe;
    let newConversationsListenerUnsubscribe;
    let newNotificationsListenerUnsubscribe;
    let onlineUsersUnsubscribe;

    onlineUsersUnsubscribe = getTotalOnlineUsers((totalOnlineUsers) => {
      if (isMounted()) setTotalOnlineUsers(totalOnlineUsers);
    });

    if (user) {
      conversationsUnsubscribe = conversationsListener(navigate, user.uid);
      isUserInQueueUnsubscribe = isUserInQueueListener(
        isMounted,
        setIsUserInQueue,
        user.uid
      );

      newConversationsListenerUnsubscribe = getUnreadConversations(
        isMounted,
        pathname.substring(0, 7) === "/search",
        setUnreadConversationsCount,
        user.uid
      );
      newNotificationsListenerUnsubscribe = getNotifications(
        isMounted,
        setNotifications,
        user
      );
    }

    const cleanup = () => {
      if (conversationsUnsubscribe) conversationsUnsubscribe();
      if (user && isUserInQueueRef.current) leaveQueue(user.uid);

      window.removeEventListener("beforeunload", cleanup);
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      cleanup();
      if (isUserInQueueUnsubscribe) isUserInQueueUnsubscribe();
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
      if (newConversationsListenerUnsubscribe)
        newConversationsListenerUnsubscribe();
      if (onlineUsersUnsubscribe) onlineUsersUnsubscribe.off("value");
    };
  }, [isMounted, setTotalOnlineUsers, user]);

  if (pathname === "/chat" && user && unreadConversationsCount > 0)
    resetUnreadConversationCount(user.uid);

  return (
    <Container
      className="sticky top-0 relative column x-fill full-center bg-white border-top large active shadow-2"
      style={{ zIndex: 10 }}
    >
      <Container className="x-fill align-center justify-between border-bottom py8 px16">
        <Link to="/">
          <img
            alt="Go Home"
            className="clickable"
            onClick={() => setMobileHeaderActive(false)}
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
              onClick={() => {
                setMobileHeaderActive(!mobileHeaderActive);
                setAccountSectionActive(false);
              }}
            />
          </Container>
        </Container>
      </Container>
      {(mobileHeaderActive || pathname.substring(0, 7) === "/search") && (
        <Space align="center" className="bg-grey-4 py4 px8 my8 br4">
          <FontAwesomeIcon
            className="grey-5 mr8"
            icon={faSearch}
            onClick={() => setMobileHeaderActive(false)}
          />
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
          className="mobile-header ov-auto shadow-2 pa16"
          direction="vertical"
          onClick={() => setMobileHeaderActive(false)}
          size="large"
          style={{ maxHeight: "350px" }}
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
                    <p className="ic">Profile</p>
                  </Link>

                  <Link
                    className={
                      "flex full-center button-3 " +
                      isPageActive("/account", pathname)
                    }
                    to="/account"
                  >
                    <FontAwesomeIcon className="mx8" icon={faUser} />
                    <p className="ic">Account</p>
                  </Link>
                  <Link
                    className={
                      "flex full-center button-3 " +
                      isPageActive("/avatar", pathname)
                    }
                    to="/avatar"
                  >
                    <FontAwesomeIcon className="mx8" icon={faUserAstronaut} />
                    <p className="ic">Avatar</p>
                  </Link>

                  <Link
                    className={
                      "flex full-center button-3 " +
                      isPageActive("/settings", pathname)
                    }
                    to="/settings"
                  >
                    <FontAwesomeIcon className="mx8" icon={faCog} />
                    <p className="ic">Settings</p>
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
              <p className="ic">Trending</p>
            </Link>
            <Link
              className={
                "flex full-center button-3 " + isPageActive("/recent", pathname)
              }
              to="/recent"
            >
              <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
              <p className="ic">Recent</p>
            </Link>
            <Link
              className={
                "button-3 flex full-center relative " +
                isPageActive("/chat", pathname)
              }
              to="/chat"
            >
              <FontAwesomeIcon className="mr8" icon={faComments} />
              <p className="ic">Inbox</p>

              {Boolean(unreadConversationsCount) && (
                <p className="fs-14 bg-red white round ml4 pa4 br4">
                  {unreadConversationsCount}
                </p>
              )}
            </Link>
            <Link
              className={
                "button-3 flex full-center relative " +
                isPageActive("/quote-contest", pathname)
              }
              to="/quote-contest"
            >
              <FontAwesomeIcon className="mr8" icon={faQuoteLeft} />
              <p className="ic">Daily Quote Contest</p>
            </Link>
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/site-info", pathname)
              }
              to="/site-info"
            >
              <FontAwesomeIcon className="mr8" icon={faInfo} />
              <p className="ic">Site Info</p>
            </Link>
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/make-friends", pathname)
              }
              to="/make-friends"
            >
              <FontAwesomeIcon className="mr8" icon={faUsers} />
              <p className="ic">Make Friends</p>
            </Link>
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/vent-to-strangers", pathname)
              }
              to="/vent-to-strangers"
            >
              <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
              <p className="ic">Post a Vent</p>
            </Link>
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/rewards", pathname)
              }
              to="/rewards"
            >
              <FontAwesomeIcon className="mr8" icon={faStarShooting} />
              <p className="ic">Rewards</p>
            </Link>
            <Link
              className={
                "flex full-center button-3 " +
                isPageActive("/people-online", pathname)
              }
              to="/people-online"
            >
              <FontAwesomeIcon className="mr8" icon={faUserFriends} />
              <p className="ic">
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
      {user && isUserInQueue && (
        <Container className="x-fill full-center bg-white border-top gap8 py8 px16">
          <p>You are in queue to chat with a stranger</p>
          <Button
            onClick={() => leaveQueue(user.uid)}
            size="large"
            type="primary"
          >
            Leave Queue
          </Button>
        </Container>
      )}
      {user && !user.emailVerified && (
        <Container className="x-fill full-center bg-grey-2">
          <h4 className="tac mr16">Please verify your email address!</h4>
          <button
            className="button-2 no-bold py8 px16 my16 br8"
            onClick={() => {
              sendEmailVerification(user)
                .then(() => {
                  message.success("Verification email sent! :)");
                })
                .catch((error) => {
                  message.error(error);
                });
            }}
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
