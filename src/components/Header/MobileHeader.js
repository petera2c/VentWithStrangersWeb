import React, { useContext, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import db from "../../config/firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnalytics } from "@fortawesome/pro-duotone-svg-icons/faAnalytics";
import { faConciergeBell } from "@fortawesome/pro-duotone-svg-icons/faConciergeBell";
import { faBell } from "@fortawesome/pro-duotone-svg-icons/faBell";
import { faSearch } from "@fortawesome/pro-solid-svg-icons/faSearch";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons/faChevronDown";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faCog } from "@fortawesome/pro-solid-svg-icons/faCog";
import { faBars } from "@fortawesome/pro-solid-svg-icons/faBars";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faUser } from "@fortawesome/pro-solid-svg-icons/faUser";

import { UserContext } from "../../context";

import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import Text from "../views/Text";

import Button from "../views/Button";

import LoginModal from "../modals/Login";
import SignUpModal from "../modals/SignUp";
import ForgotPasswordModal from "../modals/ForgotPassword";
import NotificationList from "../NotificationList";

import { capitolizeFirstChar, isPageActive, signOut } from "../../util";
import {
  getNotifications,
  newNotificationCounter,
  readNotifications
} from "./util";

function Header({ history, location }) {
  const user = useContext(UserContext);

  const [activeModal, setActiveModal] = useState("");
  const [mobileHeaderActive, setMobileHeaderActive] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(
    false
  );
  const [ventSearchString, setVentSearchString] = useState("");

  const { pathname } = location;

  const searchPosts = ventSearchString => {
    setVentSearchString(ventSearchString);
    history.push("/search?" + ventSearchString);
  };

  if (user) {
    var conversationsQuery = db
      .collection("conversations")
      .where(user.uid, "==", false);

    var [unreadConversations] = useCollectionData(conversationsQuery, {
      idField: "id"
    });
  }
  useEffect(() => {
    if (user) getNotifications(setNotifications, user);
  }, [location]);

  return (
    <Container
      className="sticky top-0 column x-fill full-center bg-white border-top large active shadow-2"
      style={{ zIndex: 10 }}
    >
      <Container className="x-fill align-center justify-between border-bottom py8 px16">
        <img
          alt=""
          className="clickable"
          onClick={() => history.push("/")}
          src={require("../../svgs/icon.svg")}
          style={{ height: "50px" }}
        />

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
          <Link
            className="button-2 no-bold py8 px16 my16 mr8 br8"
            to="/vent-to-strangers"
          >
            Post a Vent
          </Link>
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
        <Container className="x-fill full-center">
          <Link
            className={
              "button-3 tac py16 ml16 " +
              isPageActive("/trending", pathname) +
              isPageActive("/", pathname)
            }
            to="/trending"
          >
            <FontAwesomeIcon className="mr8" icon={faAnalytics} />
            Trending
          </Link>
          <Link
            className={
              "button-3 tac py16 mx16 " + isPageActive("/recent", pathname)
            }
            to="/recent"
          >
            <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
            Recent
          </Link>
          <Link
            className={
              "full-center flex button-3 relative mr32 " +
              isPageActive("/conversations", pathname)
            }
            to="/conversations"
          >
            <FontAwesomeIcon className="py16 mr8" icon={faComments} />
            <p className="bold py16">Inbox</p>

            {unreadConversations && unreadConversations.length !== 0 && (
              <p className="fs-14 bg-red white round ml4 pa4 br4">
                {unreadConversations.length}
              </p>
            )}
          </Link>
        </Container>
      )}
      {mobileHeaderActive && (
        <Container className="column x-fill bg-grey-4">
          {user && (
            <Container className="column">
              <Link to="/activity">
                <Container className="full-center py16 mx16">
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
                </Container>
              </Link>
              <Container className="bg-white x-fill">
                <Link
                  className={
                    "button-3 tac py16 mx16 " +
                    isPageActive("/activity", pathname)
                  }
                  to={"/activity"}
                >
                  <FontAwesomeIcon className="mx8" icon={faChartNetwork} />
                  Activity
                </Link>

                <Link
                  className={
                    "button-3 tac py16 mx16 " +
                    isPageActive("/account", pathname)
                  }
                  to="/account"
                >
                  <FontAwesomeIcon className="mx8" icon={faUser} />
                  Account
                </Link>

                <Link
                  className={
                    "button-3 tac py16 mx16 " +
                    isPageActive("/settings", pathname)
                  }
                  to="/settings"
                >
                  <FontAwesomeIcon className="mx8" icon={faCog} />
                  Settings
                </Link>
                <Text
                  className="button-1 full-center fw-400 tac fs-16 py16 mx16"
                  onClick={signOut}
                  text="Sign Out"
                  type="h5"
                />
              </Container>
            </Container>
          )}
          <Container className="bg-white align-center py4 px8 ma16 br4">
            <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
            <input
              className="no-border br4"
              onChange={e => searchPosts(e.target.value)}
              placeholder="Search"
              type="text"
              value={ventSearchString}
            />
          </Container>
          {!user && (
            <Container className="x-fill">
              <Button
                className="x-50 blue fw-300 bg-white border-all active px32 mr8 br4"
                text="Login"
                onClick={() => setActiveModal("login")}
              />

              <Button
                className="x-50 white blue-fade px32 py8 ml8 br4"
                text="Sign Up"
                onClick={() => setActiveModal("signUp")}
              />
            </Container>
          )}
        </Container>
      )}

      {activeModal === "login" && (
        <LoginModal setActiveModal={setActiveModal} />
      )}
      {activeModal === "signUp" && (
        <SignUpModal setActiveModal={setActiveModal} />
      )}
      {activeModal === "forgotPassword" && (
        <ForgotPasswordModal setActiveModal={setActiveModal} />
      )}
    </Container>
  );
}

export default withRouter(Header);
