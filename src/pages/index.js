import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";

import ReactGA from "react-ga";
import { Helmet } from "react-helmet";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { UserContext } from "../context";

import Container from "../components/containers/Container";
import Header from "../components/Header";
import MobileHeader from "../components/Header/MobileHeader";
import Sidebar from "../components/Sidebar";

import AboutUsPage from "./AboutUs";
import AccountPage from "./Account/Account";
import AppDownloadPage from "./AppDownload";
import AvatarPage from "./Account/Avatar";
import ConversationsPage from "./Conversations";
import FeedbackPage from "./Feedback";
import FriendsPage from "./Friends";
import MakeFriendsPage from "./MakeFriends";
import NewVentPage from "./NewVent";
import NotFoundPage from "./NotFound";
import NotificationsPage from "./Notifications";
import OnlineUsersPage from "./OnlineUsers";
import PrivacyPolicyPage from "./PrivacyPolicy";
import ProfilePage from "./Account/Profile";
import SearchPage from "./Search";
import SettingsPage from "./Account/Settings";
import SignUpPage from "./SignUp";
import SubscribePage from "./Subscribe";
import SubSuccessPage from "./SubscriptionSuccess";
import VentPage from "./Vent";
import VentsPage from "./Vents";
import VerifiedEmailPage from "./EmailAuth/VerifiedEmail";

import { getUserBasicInfo, isMobileOrTablet } from "../util";
import {
  getIsUserSubscribed,
  setIsUserOnlineToDatabase,
  setUserOnlineStatus,
} from "./util";

function RoutesComp() {
  const [user, loading, error] = useAuthState(firebase.auth());
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [userSubscription, setUserSubscription] = useState();

  const handleOnIdle = (event) => {
    if (user && user.uid) setUserOnlineStatus("offline", user.uid);
  };

  const handleOnActive = (event) => {
    if (user && user.uid) setUserOnlineStatus("online", user.uid);
  };

  useIdleTimer({
    timeout: 1000 * 60 * 3,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 500,
  });

  useEffect(() => {
    if (user) getIsUserSubscribed(setUserSubscription, user.uid);
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
    <UserContext.Provider
      value={{
        user,
        userBasicInfo,
        userSubscription,
        setUserBasicInfo,
        setUserSubscription,
      }}
    >
      <Router>
        <Container className="screen-container column ov-hidden">
          {!isMobileOrTablet() && <Header />}
          {isMobileOrTablet() && <MobileHeader />}

          <Container className="flex-fill x-fill ov-hidden">
            {!isMobileOrTablet() && <Sidebar />}
            {error && { error }}
            {!loading && !error && (
              <Routes>
                <Route path="/*" element={<NotFoundPage />} />
                <Route path="" element={<VentsPage />} />
                {user && <Route path="account" element={<AccountPage />} />}
                {!user && <Route path="account" element={<SignUpPage />} />}
                <Route path="app-downloads" element={<AppDownloadPage />} />
                {user && <Route path="avatar" element={<AvatarPage />} />}
                {!user && <Route path="avatar" element={<SignUpPage />} />}
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
                <Route path="profile" element={<ProfilePage />} />
                <Route path="recent" element={<VentsPage />} />
                <Route path="search" element={<SearchPage />} />
                {user && <Route path="settings" element={<SettingsPage />} />}
                {!user && <Route path="settings" element={<SignUpPage />} />}
                <Route path="site-info" element={<AboutUsPage />} />
                <Route path="subscribe" element={<SubscribePage />} />
                <Route
                  path="subscription-successful"
                  element={<SubSuccessPage />}
                />
                <Route path="trending" element={<VentsPage />} />
                <Route path="vent-to-strangers" element={<NewVentPage />} />
                <Route path="vent-to-strangers/:id" element={<NewVentPage />} />
                <Route path="verified-email" element={<VerifiedEmailPage />} />
              </Routes>
            )}
          </Container>
        </Container>
      </Router>
    </UserContext.Provider>
  );
}

export default RoutesComp;
