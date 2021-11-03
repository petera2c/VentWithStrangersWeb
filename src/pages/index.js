import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation
} from "react-router-dom";
import moment from "moment-timezone";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { UserContext } from "../context";

import Container from "../components/containers/Container";

import Header from "../components/Header";
import MobileHeader from "../components/Header/MobileHeader";
import LoadingHeart from "../components/loaders/Heart";

import AboutUsPage from "./AboutUs";
import AccountPage from "./Account";
import AppDownloadPage from "./AppDownload";
import BlogPage from "./Blog";
import ConversationsPage from "./Conversations";
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

import { isMobileOrTablet } from "../util";
import { setIsUserOnlineToDatabase } from "./util";

function Routes() {
  const [user, loading, error] = useAuthState(firebase.auth());

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
        <Container className="screen-container column">
          {!isMobileOrTablet() && <Header />}
          {isMobileOrTablet() && <MobileHeader />}
          {loading && (
            <Container className="x-fill full-center">
              <LoadingHeart />
            </Container>
          )}
          {error && { error }}
          {!loading && !error && (
            <Switch>
              <Route
                path="/blogs/why-talking-about-mental-health-is-important/"
                component={MentalHealthPage}
              />
              <Route path="/make-friends/" component={MakeFriendsPage} />
              <Route path="/friends/" component={FriendsPage} />
              <Route path="/" component={VentsPage} exact />
              <Route path="/account/" component={AccountPage} exact />
              <Route path="/app-downloads/" component={AppDownloadPage} />
              <Route path="/blog/" component={BlogPage} />
              <Route path="/conversations/" component={ConversationsPage} />
              <Route path="/feedback/" component={FeedbackPage} />
              <Route path="/home/" component={VentsPage} />
              <Route path="/notifications/" component={NotificationsPage} />
              <Route path="/popular/" component={VentsPage} />
              <Route path="/privacy-policy/" component={PrivacyPolicyPage} />
              <Route path="/problem/" component={VentPage} />
              <Route path="/profile/" component={AccountPage} />
              <Route path="/recent/" component={VentsPage} />
              <Route path="/search/" component={SearchPage} />
              <Route path="/settings/" component={AccountPage} exact />
              <Route path="/site-info/" component={AboutUsPage} />
              <Route path="/trending/" component={VentsPage} />
              <Route path="/vent-to-a-stranger/" component={SignUpPage} />
              <Route path="/vent-to-strangers/" component={NewVentPage} />
              <Route component={NotFoundPage} />
            </Switch>
          )}
        </Container>
      </Router>
    </UserContext.Provider>
  );
}

export default Routes;
