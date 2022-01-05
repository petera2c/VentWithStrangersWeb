import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import Avatar from "avataaars";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnalytics } from "@fortawesome/pro-duotone-svg-icons/faAnalytics";
import { faConciergeBell } from "@fortawesome/pro-duotone-svg-icons/faConciergeBell";
import { faBell } from "@fortawesome/pro-duotone-svg-icons/faBell";
import { faSearch } from "@fortawesome/pro-solid-svg-icons/faSearch";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons/faChevronDown";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons/faUsers";

import { Button } from "antd";

import { UserContext } from "../../context";

import StarterModal from "../modals/Starter";

import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import Text from "../views/Text";

import NotificationList from "../NotificationList";

import {
  capitolizeFirstChar,
  getUserBasicInfo,
  isPageActive
} from "../../util";
import {
  getNotifications,
  getUnreadConversations,
  howCompleteIsUserProfile,
  newNotificationCounter,
  readNotifications,
  resetUnreadConversationCount
} from "./util";

function Header({ history, location }) {
  const componentIsMounted = useRef(true);
  const { pathname, search } = location;

  const user = useContext(UserContext);

  const [activeModal, setActiveModal] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showFeedback, setShowFeedback] = useState(true);
  const [missingAccountPercentage, setMissingAccountPercentage] = useState();
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(
    false
  );
  const [unreadConversationsCount, setUnreadConversationsCount] = useState();
  const [userBasicInfo, setUserBasicInfo] = useState({});

  const [ventSearchString, setVentSearchString] = useState(
    pathname.substring(0, 7) === "/search"
      ? search.substring(1, search.length)
      : ""
  );

  let newNotificationsListenerUnsubscribe;
  let newConversationsListenerUnsubscribe;

  useEffect(() => {
    if (newNotificationsListenerUnsubscribe)
      newNotificationsListenerUnsubscribe();
    if (newConversationsListenerUnsubscribe)
      newConversationsListenerUnsubscribe();

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
    <Container className="column x-fill sticky top-0" style={{ zIndex: 10 }}>
      <Container className="column x-fill justify-center bg-white border-top large active">
        <Container className="x-fill align-center">
          <Container
            className="full-center"
            style={{ width: "calc(12.5vw - 24px)" }}
          >
            <img
              alt=""
              className="clickable"
              onClick={() => history.push("/")}
              src={require("../../svgs/icon.svg")}
              style={{ height: "50px" }}
            />
          </Container>

          <Container className="flex-fill align-center wrap">
            <Link
              className={
                "full-center flex button-3 mr32 " +
                isPageActive("/trending", pathname.substring(0, 9)) +
                isPageActive("/", pathname)
              }
              to="/trending"
            >
              <FontAwesomeIcon className="mr8" icon={faAnalytics} />
              <p className="py16">Trending</p>
            </Link>
            <Link
              className={
                "full-center flex button-3 mr32 " +
                isPageActive("/recent", pathname.substring(0, 7))
              }
              to="/recent"
            >
              <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
              <p className="py16">Recent</p>
            </Link>
            <Link
              className={
                "full-center flex button-3 mr32 " +
                isPageActive("/conversations", pathname.substring(0, 14))
              }
              to="/conversations"
            >
              <FontAwesomeIcon className="mr8" icon={faComments} />
              <p className="py16">Inbox</p>

              {Boolean(unreadConversationsCount) && (
                <p className="fs-14 bg-red white round ml4 pa4 br4">
                  {unreadConversationsCount}
                </p>
              )}
            </Link>
            <Link
              className={
                "full-center flex button-3 mr32  " +
                isPageActive("/make-friends", pathname.substring(0, 13))
              }
              to="/make-friends"
            >
              <FontAwesomeIcon className="mr8" icon={faUsers} />
              <p className="py16">Make Friends</p>
            </Link>
            <Container className="full-center bg-grey-4 py4 px8 my16 mr16 br4">
              <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
              <input
                autoFocus={
                  pathname.substring(0, 7) === "/search" ? true : false
                }
                className="no-border bg-grey-4 br4"
                onChange={e => {
                  setVentSearchString(e.target.value);
                  history.push("/search?" + e.target.value);
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
          <Container className="full-center wrap mx32 my16">
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
              <Container className="align-center wrap">
                <Link className="flex full-center mr16" to="/profile">
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
                </Link>

                <HandleOutsideClick
                  className="relative"
                  close={() => setShowNotificationDropdown(false)}
                >
                  <FontAwesomeIcon
                    className="clickable blue"
                    icon={faBell}
                    onClick={() => {
                      setShowNotificationDropdown(!showNotificationDropdown);

                      readNotifications(notifications);
                    }}
                    size="2x"
                  />
                  {showNotificationDropdown && (
                    <Container
                      className="container small bg-white shadow-2 ov-auto br8"
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        maxHeight: "300px"
                      }}
                    >
                      <NotificationList notifications={notifications} />
                    </Container>
                  )}
                  {newNotificationCounter(notifications) &&
                    !showNotificationDropdown && (
                      <Text
                        className="fs-14 bg-red white pa4 br8"
                        style={{
                          position: "absolute",
                          top: "-12px",
                          right: "-12px",
                          pointerEvents: "none"
                        }}
                        type="p"
                      >
                        {newNotificationCounter(notifications)}
                      </Text>
                    )}
                </HandleOutsideClick>
              </Container>
            )}
          </Container>
        </Container>

        {false && (
          <Container className="flex-fill wrap full-center bg-grey-4 px32">
            <p className="flex-fill tac py16">
              <Link to="/feedback">
                Give us feedback on our website{" "}
                <span className="blue">here</span>
              </Link>
            </p>
            <Container
              className="clickable round-icon"
              onClick={() => setShowFeedback(false)}
            >
              <FontAwesomeIcon className="white" icon={faTimes} />
            </Container>
          </Container>
        )}
        <StarterModal
          activeModal={activeModal}
          setActiveModal={setActiveModal}
        />
      </Container>
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
      {false &&
        missingAccountPercentage !== undefined &&
        missingAccountPercentage !== 1 && (
          <Container className="column full-center bg-grey-2">
            <div>hello there</div>
          </Container>
        )}
    </Container>
  );
}

function Hit(props) {
  const { hit } = props;
  return (
    <Container className="column">
      <h4>{hit.title.substring(0, 40)}</h4>
      <p>{hit.description.substring(0, 40)}</p>
    </Container>
  );
}

export default withRouter(Header);
