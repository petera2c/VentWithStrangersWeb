import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import moment from "moment-timezone";
import { useIdleTimer } from "react-idle-timer";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
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

import { getUserBasicInfo, isMobileOrTablet } from "../util";
import { setIsUserOnlineToDatabase, setUserOnlineStatus } from "./util";

function RoutesTest() {
  const [user, loading, error] = useAuthState(firebase.auth());
  const [userBasicInfo, setUserBasicInfo] = useState({});

  const handleOnIdle = (event) => {
    if (user && user.uid) setUserOnlineStatus("offline", user.uid);
  };

  const handleOnActive = (event) => {
    if (user && user.uid) setUserOnlineStatus("online", user.uid);
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 15,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 500,
  });

  useEffect(() => {
    setIsUserOnlineToDatabase(user);

    if (user)
      getUserBasicInfo((newBasicUserInfo) => {
        setUserBasicInfo(newBasicUserInfo);
      }, user.uid);
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
    <UserContext.Provider value={{ user, userBasicInfo }}>
      <Router>
        {error && { error }}
        {!loading && !error && (
          <Routes>
            <Route
              path="/blogs/why-talking-about-mental-health-is-important"
              element={<MentalHealthPage />}
            />
            <Route path="/make-friends" element={<MakeFriendsPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/" element={<VentsPage />} exact />
            <Route path="/account" element={<AccountPage />} exact />
            <Route path="/app-downloads" element={<AppDownloadPage />} />
            <Route path="/avatar" element={<AccountPage />} exact />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/conversations" element={<ConversationsPage />} />
            <Route path="/online-users" element={<OnlineUsersPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/home" element={<VentsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/popular" element={<VentsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/problem" element={<VentPage />} />
            <Route path="/profile" element={<AccountPage />} />
            <Route path="/recent" element={<VentsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<AccountPage />} exact />
            <Route path="/site-info" element={<AboutUsPage />} />
            <Route path="/trending" element={<VentsPage />} />
            <Route path="/vent-to-strangers" element={<NewVentPage />} />
            <Route path="/verified-email" element={<VerifiedEmailPage />} />
            <Route element={<NotFoundPage />} />
          </Routes>
        )}
      </Router>
    </UserContext.Provider>
  );
}

export default RoutesTest;
