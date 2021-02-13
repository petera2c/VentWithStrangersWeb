import React, { useContext, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/database";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnalytics } from "@fortawesome/pro-duotone-svg-icons/faAnalytics";
import { faConciergeBell } from "@fortawesome/pro-duotone-svg-icons/faConciergeBell";
import { faBell } from "@fortawesome/pro-duotone-svg-icons/faBell";
import { faSearch } from "@fortawesome/pro-solid-svg-icons/faSearch";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons/faChevronDown";

import { UserContext } from "../../context";

import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import Text from "../views/Text";

import Button from "../views/Button";

import LoginModal from "../modals/Login";
import SignUpModal from "../modals/SignUp";
import NotificationList from "../NotificationList";

import { capitolizeFirstChar, isPageActive } from "../../util";
import { newNotificationCounter } from "./util";

function Header({ history, location }) {
  const user = useContext(UserContext);

  const [loginModalBoolean, setLoginModalBoolean] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(
    false
  );
  const [signUpModalBoolean, setSignUpModalBoolean] = useState(false);
  const [ventSearchString, setVentSearchString] = useState("");

  const { pathname } = location;

  const searchPosts = ventSearchString => {
    setVentSearchString({ ventSearchString });
    history.push("/search?" + ventSearchString);
  };

  const db = firebase.database();

  const notificationsRef = db.ref("/notifications/" + user.uid);
  const notificationsQuery = notificationsRef
    .orderByChild("server_timestamp")
    .limitToLast(5);

  useEffect(() => {
    notificationsQuery.on("value", snapshot => {
      if (!snapshot) return;
      const value = snapshot.val();
      const exists = snapshot.exists();

      if (exists)
        setNotifications(
          Object.keys(value).map(ventID => {
            return { id: ventID, ...value[ventID] };
          })
        );
      else setNotifications([]);
    });
  }, [location]);

  const readNotifications = () => {
    for (let index in notifications) {
      const notification = notifications[index];
      if (!notification.hasSeen) {
        const notificationRef = notificationsRef.child(notification.id);
        notificationRef.update({
          hasSeen: "true"
        });
      }
    }
  };

  return (
    <Container
      className="sticky top-0 x-fill justify-center bg-white shadow-2 border-top large active"
      style={{ zIndex: 10 }}
    >
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
        <Container
          className="align-center wrap"
          style={{
            maxWidth: "1500px",
            width: "60vw"
          }}
        >
          <Link
            className={
              "button-3 py16 mr32 " +
              isPageActive("/recent", pathname.substring(0, 7)) +
              isPageActive("/", pathname)
            }
            to="/recent"
          >
            <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
            Recent
          </Link>
          <Link
            className={
              "button-3 py16 mr32 " +
              isPageActive("/trending", pathname.substring(0, 9))
            }
            to="/trending"
          >
            <FontAwesomeIcon className="mr8" icon={faAnalytics} />
            Trending
          </Link>

          <Container className="border-all active py4 mr16 my16 br4">
            <Link className="border-right active blue px8" to="/post-a-problem">
              Vent
            </Link>
            <Link className="blue px8" to="/chats">
              Chat
            </Link>
          </Container>

          <Container className="full-center bg-grey-4 py4 px8 my16 mr16 br4">
            <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
            <input
              className="no-border bg-grey-4 br4"
              onChange={e => searchPosts(e.target.value)}
              placeholder="Search"
              type="text"
              value={ventSearchString}
            />
          </Container>

          <a
            className="button-2 no-bold py8 px16 my16 br8"
            href="https://donorbox.org/vws-site-donation?default_interval=o"
            target="_blank"
          >
            Donate
          </a>
        </Container>
        <Container className="flex-fill full-center wrap mx32 my16">
          {!user && (
            <Button
              className="blue fw-300 mx32"
              text="Login"
              onClick={() => setLoginModalBoolean(true)}
            />
          )}
          {!user && (
            <Button
              className="white blue-fade px32 py8 br4"
              text="Sign Up"
              onClick={() => setSignUpModalBoolean(true)}
            />
          )}
          {user && (
            <Container className="align-center wrap">
              <Link className="flex full-center mr16" to="/activity">
                <Text
                  className="round-icon bg-blue white mr8"
                  text={capitolizeFirstChar(user.displayName[0])}
                  type="h6"
                />

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

                    readNotifications();
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

      {loginModalBoolean && (
        <LoginModal
          close={() => setLoginModalBoolean(false)}
          openSignUpModal={() => {
            setSignUpModalBoolean(true);
            setLoginModalBoolean(false);
          }}
        />
      )}
      {signUpModalBoolean && (
        <SignUpModal
          close={() => setSignUpModalBoolean(false)}
          openLoginModal={() => {
            setSignUpModalBoolean(false);
            setLoginModalBoolean(true);
          }}
        />
      )}
    </Container>
  );
}

export default withRouter(Header);
