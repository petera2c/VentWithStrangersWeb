import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import moment from "moment-timezone";
import { useIdleTimer } from "react-idle-timer";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { UserContext } from "../context";

import Container from "../components/containers/Container";
import LoadingHeart from "../components/loaders/Heart";

import AboutUsPage from "./AboutUs";
import AccountPage from "./Account";
import AppDownloadPage from "./AppDownload";
import BlogPage from "./Blog";
import ConversationsPage from "./Conversations";
import OnlineUsersPage from "./OnlineUsers";
import FeedbackPage from "./Feedback";
import FriendsPage from "./Friends";
import MakeFriendsPage from "./MakeFriends";
import MentalHealthPage from "./Blogs/MentalHealth";
import NewVentPage from "./NewVent";
import NotFoundPage from "./NotFound";
import NotificationsPage from "./Notifications";
import PrivacyPolicyPage from "./PrivacyPolicy";
import SearchPage from "./Search";
import SignUpPage from "./SignUp";
import VentPage from "./Vent";
import VentsPage from "./Vents";
import VerifiedEmailPage from "./EmailAuth/VerifiedEmail";

import { isMobileOrTablet } from "../util";
import { setIsUserOnlineToDatabase, setUserOnlineStatus } from "./util";

function Routes() {
  const [user, loading, error] = useAuthState(firebase.auth());

  const handleOnIdle = event => {
    if (user && user.uid) setUserOnlineStatus("offline", user.uid);
  };

  const handleOnActive = event => {
    if (user && user.uid) setUserOnlineStatus("online", user.uid);
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 15,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 500
  });

  useEffect(() => {
    setIsUserOnlineToDatabase(user);
  }, [user]);

  if (loading)
    return (
      <Container className="screen-container full-center pr32">
        <img
          alt=""
          className="loading-animation"
          src={require("../svgs/icon.svg")}
          style={{ height: "280px" }}
        />
      </Container>
    );

  return (
    <UserContext.Provider value={user}>
      <Router>
        {error && { error }}
        {!loading && !error && (
          <Switch>
            <Route
              path="/blogs/why-talking-about-mental-health-is-important"
              component={MentalHealthPage}
            />
            <Route path="/make-friends" component={MakeFriendsPage} />
            <Route path="/friends" component={FriendsPage} />
            <Route path="/" component={VentsPage} exact />
            <Route path="/account" component={AccountPage} exact />
            <Route path="/app-downloads" component={AppDownloadPage} />
            <Route path="/avatar" component={AccountPage} exact />
            <Route path="/blog" component={BlogPage} />
            <Route path="/conversations" component={ConversationsPage} />
            <Route path="/online-users" component={OnlineUsersPage} />
            <Route path="/feedback" component={FeedbackPage} />
            <Route path="/home" component={VentsPage} />
            <Route path="/notifications" component={NotificationsPage} />
            <Route path="/popular" component={VentsPage} />
            <Route path="/privacy-policy" component={PrivacyPolicyPage} />
            <Route path="/problem" component={VentPage} />
            <Route path="/profile" component={AccountPage} />
            <Route path="/recent" component={VentsPage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/settings" component={AccountPage} exact />
            <Route path="/site-info" component={AboutUsPage} />
            <Route path="/trending" component={VentsPage} />
            <Route path="/vent-to-strangers" component={NewVentPage} />
            <Route path="/verified-email" component={VerifiedEmailPage} />
            <Route component={NotFoundPage} />
          </Switch>
        )}
      </Router>
    </UserContext.Provider>
  );
}

export default Routes;
