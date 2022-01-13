import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { UserContext } from "../context";

import Container from "../components/containers/Container";

import AboutUsPage from "./AboutUs";
import AccountPage from "./Account";
import AppDownloadPage from "./AppDownload";
import ConversationsPage from "./Conversations";
import OnlineUsersPage from "./OnlineUsers";
import FeedbackPage from "./Feedback";
import FriendsPage from "./Friends";
import MakeFriendsPage from "./MakeFriends";
import NewVentPage from "./NewVent";
import NotFoundPage from "./NotFound";
import NotificationsPage from "./Notifications";
import PrivacyPolicyPage from "./PrivacyPolicy";
import SearchPage from "./Search";
import VentPage from "./Vent";
import VentsPage from "./Vents";
import VerifiedEmailPage from "./EmailAuth/VerifiedEmail";

import { getUserBasicInfo } from "../util";
import { setIsUserOnlineToDatabase, setUserOnlineStatus } from "./util";

function RoutesComp() {
  const [user, loading, error] = useAuthState(firebase.auth());
  const [userBasicInfo, setUserBasicInfo] = useState({});

  const handleOnIdle = (event) => {
    if (user && user.uid) setUserOnlineStatus("offline", user.uid);
  };

  const handleOnActive = (event) => {
    if (user && user.uid) setUserOnlineStatus("online", user.uid);
  };

  useIdleTimer({
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

    return () => {
      if (user) setUserOnlineStatus("offline", user.uid);
    };
  }, [user]);

  if (loading)
    return (
      <Container className="screen-container full-center pr32">
        <img
          alt=""
          className="loading-animation"
          src="/svgs/icon.svg"
          style={{ height: "280px" }}
        />
      </Container>
    );

  return (
    <UserContext.Provider value={{ user, userBasicInfo, setUserBasicInfo }}>
      <Router>
        {error && { error }}
        {!loading && !error && (
          <Routes>
            <Route element={<NotFoundPage />} />
            <Route path="" element={<VentsPage />} exact />
            <Route path="account" element={<AccountPage />} exact />
            <Route path="app-downloads" element={<AppDownloadPage />} />
            <Route path="avatar" element={<AccountPage />} exact />
            <Route path="conversations" element={<ConversationsPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="friends" element={<FriendsPage />} />
            <Route path="home" element={<VentsPage />} />
            <Route path="make-friends" element={<MakeFriendsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="online-users" element={<OnlineUsersPage />} />
            <Route path="popular" element={<VentsPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="problem/:id" element={<VentPage />} />
            <Route path="problem/:id/:title" element={<VentPage />} />
            <Route path="profile" element={<AccountPage />} />
            <Route path="recent" element={<VentsPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="settings" element={<AccountPage />} exact />
            <Route path="site-info" element={<AboutUsPage />} />
            <Route path="trending" element={<VentsPage />} />
            <Route path="vent-to-strangers" element={<NewVentPage />} />
            <Route path="vent-to-strangers/:id" element={<NewVentPage />} />
            <Route path="verified-email" element={<VerifiedEmailPage />} />
          </Routes>
        )}
      </Router>
    </UserContext.Provider>
  );
}

export default RoutesComp;
