import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Dropdown, message } from "antd";
import { sendEmailVerification } from "firebase/auth";

import { faAnalytics } from "@fortawesome/pro-duotone-svg-icons/faAnalytics";
import { faBell } from "@fortawesome/pro-duotone-svg-icons/faBell";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons/faChevronDown";
import { faCog } from "@fortawesome/pro-duotone-svg-icons/faCog";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faConciergeBell } from "@fortawesome/pro-duotone-svg-icons/faConciergeBell";
import { faSearch } from "@fortawesome/pro-solid-svg-icons/faSearch";
import { faSignOut } from "@fortawesome/pro-duotone-svg-icons/faSignOut";
import { faUser } from "@fortawesome/pro-duotone-svg-icons/faUser";
import { faUserAstronaut } from "@fortawesome/pro-duotone-svg-icons/faUserAstronaut";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../containers/Container";
import MakeAvatar from "../MakeAvatar";
import NotificationList from "../NotificationList";
import StarterModal from "../modals/Starter";

import { UserContext } from "../../context";

import {
  capitolizeFirstChar,
  isPageActive,
  signOut,
  useIsMounted,
} from "../../util";
import {
  getNotifications,
  getUnreadConversations,
  newNotificationCounter,
  readNotifications,
  resetUnreadConversationCount,
} from "./util";

function AccountLink({ icon, link, onClick, pathname, text }) {
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
      <div
        className="x-fill align-center grid-1 button-4 clickable py8"
        onClick={onClick}
      >
        <Container className="full-center">
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.25rem" }} />
        </Container>
        <h5 className="grey-1 inherit-color">{text}</h5>
      </div>
    );
}

function Header() {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname, search } = location;

  const { user, userBasicInfo } = useContext(UserContext);

  const [activeModal, setActiveModal] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadConversationsCount, setUnreadConversationsCount] = useState();

  const [ventSearchString, setVentSearchString] = useState(
    pathname.substring(0, 7) === "/search"
      ? search.substring(1, search.length)
      : ""
  );

  useEffect(() => {
    let newNotificationsListenerUnsubscribe;
    let newConversationsListenerUnsubscribe;

    if (user) {
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

    return () => {
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
      if (newConversationsListenerUnsubscribe)
        newConversationsListenerUnsubscribe();
    };
  }, [isMounted, pathname, user]);

  if (pathname === "/chat" && user && unreadConversationsCount > 0)
    resetUnreadConversationCount(user.uid);

  return (
    <Container className="column x-fill">
      <Container className="column x-fill justify-center bg-white border-top large active">
        <Container className="grid-3 x-fill align-center px32 py8">
          <Container className="full-center">
            <Link to="/">
              <img
                alt=""
                className="clickable"
                src="/svgs/icon.svg"
                style={{ height: "50px" }}
              />
            </Link>
          </Container>

          <Container className="flex-fill full-center wrap gap32">
            <Link
              className={
                "full-center flex button-3 gap4 py4 " +
                isPageActive("/trending", pathname.substring(0, 9)) +
                isPageActive("/", pathname)
              }
              to="/trending"
            >
              <FontAwesomeIcon icon={faAnalytics} />
              <p className="inherit-color">Trending</p>
            </Link>
            <Link
              className={
                "full-center flex button-3 gap4 py4 " +
                isPageActive("/recent", pathname.substring(0, 7))
              }
              to="/recent"
            >
              <FontAwesomeIcon icon={faConciergeBell} />
              <p className="inherit-color">Recent</p>
            </Link>
            <Link
              className={
                "full-center flex button-3 gap4 py4 " +
                isPageActive("/chat", pathname.substring(0, 14))
              }
              to="/chat"
            >
              <FontAwesomeIcon icon={faComments} />
              <p className="inherit-color">Inbox</p>

              {Boolean(unreadConversationsCount) && (
                <p className="fs-14 bg-red white round ml4 pa4 br4">
                  {unreadConversationsCount}
                </p>
              )}
            </Link>
            <Container className="full-center bg-grey-4 py4 px8 br4">
              <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
              <input
                autoFocus={
                  pathname.substring(0, 7) === "/search" ? true : false
                }
                className="no-border bg-grey-4 br4"
                onChange={(e) => {
                  setVentSearchString(e.target.value);

                  if (
                    e.target.value ||
                    (!e.target.value && pathname === "search")
                  )
                    navigate("/search?" + e.target.value);
                }}
                placeholder="Search"
                type="text"
                value={ventSearchString}
              />
            </Container>
            <Link to="/vent-to-strangers">
              <Button size="large" type="primary">
                Post a Vent
              </Button>
            </Link>
          </Container>
          <Container className="full-center wrap">
            {!user && (
              <button
                className="blue fw-300 mx32"
                onClick={() => setActiveModal("login")}
              >
                Login
              </button>
            )}
            {!user && (
              <button
                className="white blue-fade px32 py8 br4"
                onClick={() => setActiveModal("signUp")}
              >
                Sign Up
              </button>
            )}
            {user && (
              <Container className="align-center gap16">
                <Dropdown
                  overlay={
                    <div className="bg-white shadow-2 pa8 br8">
                      <AccountLink
                        icon={faChartNetwork}
                        link="/profile"
                        pathname={pathname}
                        text="My Public Profile"
                      />
                      <AccountLink
                        icon={faUser}
                        link="/account"
                        pathname={pathname}
                        text="Account"
                      />
                      <AccountLink
                        icon={faUserAstronaut}
                        link="/avatar"
                        pathname={pathname}
                        text="Avatar"
                      />
                      <AccountLink
                        icon={faCog}
                        link="/settings"
                        pathname={pathname}
                        text="Notification Settings"
                      />
                      <AccountLink
                        icon={faSignOut}
                        onClick={() => {
                          signOut(user.uid);
                        }}
                        pathname={pathname}
                        text="Sign Out"
                      />
                    </div>
                  }
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <Container className="flex-fill align-center ov-hidden clickable gap4">
                    <MakeAvatar
                      displayName={user.displayName}
                      userBasicInfo={userBasicInfo}
                    />
                    <p className="ellipsis">{`Hello, ${capitolizeFirstChar(
                      user.displayName
                    )}`}</p>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </Container>
                </Dropdown>

                <Dropdown
                  overlay={
                    <Container
                      className="container small bg-white shadow-2 ov-auto br8"
                      style={{
                        maxHeight: "300px",
                      }}
                    >
                      <NotificationList notifications={notifications} />
                    </Container>
                  }
                  onVisibleChange={(isVisible) =>
                    readNotifications(notifications)
                  }
                  trigger={["click"]}
                >
                  <Container className="clickable relative">
                    <FontAwesomeIcon className="blue" icon={faBell} size="2x" />
                    {newNotificationCounter(notifications) && (
                      <p
                        className="fs-14 bg-red white pa4 br8"
                        style={{
                          position: "absolute",
                          top: "-12px",
                          right: "-12px",
                          pointerEvents: "none",
                        }}
                      >
                        {newNotificationCounter(notifications)}
                      </p>
                    )}
                  </Container>
                </Dropdown>
              </Container>
            )}
          </Container>
        </Container>

        <StarterModal
          activeModal={activeModal}
          setActiveModal={setActiveModal}
        />
      </Container>
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
    </Container>
  );
}

export default Header;
