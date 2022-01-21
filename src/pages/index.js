import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import loadable from "@loadable/component";
import { useIdleTimer } from "react-idle-timer";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { OnlineUsersContext, UserContext } from "../context";

import { getUserBasicInfo, isMobileOrTablet, useIsMounted } from "../util";
import {
  getIsUserSubscribed,
  newRewardListener,
  setIsUserOnlineToDatabase,
  setUserOnlineStatus,
} from "./util";

const Container = loadable(() => import("../components/containers/Container"));
const Header = loadable(() => import("../components/Header"));
const LoadingHeart = loadable(() => import("../components/loaders/Heart"));
const MobileHeader = loadable(() =>
  import("../components/Header/MobileHeader")
);
const NewRewardModal = loadable(() => import("../components/modals/NewReward"));
const Sidebar = loadable(() => import("../components/Sidebar"));

const AboutUsPage = React.lazy(() => import("./AboutUs"));
const AccountPage = React.lazy(() => import("./Account/Account"));
const AvatarPage = React.lazy(() => import("./Account/Avatar"));
const ChatWithStrangersPage = React.lazy(() => import("./ChatWithStrangers"));
const ConversationsPage = React.lazy(() => import("./Conversations"));
const FriendsPage = React.lazy(() => import("./Friends"));
const MakeFriendsPage = React.lazy(() => import("./MakeFriends"));
const NewVentPage = React.lazy(() => import("./NewVent"));
const NotFoundPage = React.lazy(() => import("./NotFound"));
const NotificationsPage = React.lazy(() => import("./Notifications"));
const OnlineUsersPage = React.lazy(() => import("./OnlineUsers"));
const PrivacyPolicyPage = React.lazy(() => import("./PrivacyPolicy"));
const ProfilePage = React.lazy(() => import("./Account/Profile"));
const RewardsPage = React.lazy(() => import("./Rewards"));
const RulesPage = React.lazy(() => import("./Rules"));
const SearchPage = React.lazy(() => import("./Search"));
const SettingsPage = React.lazy(() => import("./Account/Settings"));
const SignUpPage = React.lazy(() => import("./SignUp"));
const SubscribePage = React.lazy(() => import("./Subscribe"));
const SubSuccessPage = React.lazy(() => import("./SubscriptionSuccess"));
const VentPage = React.lazy(() => import("./Vent"));
const VentsPage = React.lazy(() => import("./Vents"));
const VerifiedEmailPage = React.lazy(() => import("./EmailAuth/VerifiedEmail"));

function RoutesComp() {
  const isMounted = useIsMounted();
  const [user] = useAuthState(firebase.auth());
  const [totalOnlineUsers, setTotalOnlineUsers] = useState();
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [userSubscription, setUserSubscription] = useState();
  const [newReward, setNewReward] = useState();

  const handleOnIdle = (event) => {
    if (user && user.uid) setUserOnlineStatus("offline", user.uid);
  };

  const handleOnActive = (event) => {
    if (user && user.uid) setUserOnlineStatus("online", user.uid);
  };

  const handleOnAction = (event) => {
    if (user && user.uid) setUserOnlineStatus("online", user.uid);
  };

  useIdleTimer({
    timeout: 1000 * 60 * 480,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 5000,
  });

  useEffect(() => {
    let newRewardListenerUnsubscribe;
    if (user) {
      newRewardListenerUnsubscribe = newRewardListener(
        isMounted,
        setNewReward,
        user.uid
      );

      setIsUserOnlineToDatabase(user);
      getIsUserSubscribed(setUserSubscription, user.uid);

      getUserBasicInfo((newBasicUserInfo) => {
        setUserBasicInfo(newBasicUserInfo);
      }, user.uid);
    }

    return () => {
      if (newRewardListenerUnsubscribe) newRewardListenerUnsubscribe();
      if (user) setUserOnlineStatus("offline", user.uid);
    };
  }, [isMounted, user]);

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
      <OnlineUsersContext.Provider
        value={{
          setTotalOnlineUsers,
          totalOnlineUsers,
        }}
      >
        <Router>
          <Container className="screen-container column ov-hidden">
            {!isMobileOrTablet() && <Header />}
            {isMobileOrTablet() && <MobileHeader />}

            <Container className="flex-fill x-fill ov-hidden">
              {!isMobileOrTablet() && <Sidebar />}
              <Suspense
                fallback={
                  <Container className="x-fill full-center bg-grey-2">
                    <LoadingHeart />
                  </Container>
                }
              >
                <Routes>
                  {!user && <Route path="account" element={<SignUpPage />} />}
                  {!user && <Route path="avatar" element={<SignUpPage />} />}
                  {!user && <Route path="settings" element={<SignUpPage />} />}
                  {user && <Route path="account" element={<AccountPage />} />}
                  {user && <Route path="avatar" element={<AvatarPage />} />}
                  {user && <Route path="settings" element={<SettingsPage />} />}
                  <Route path="" element={<VentsPage />} />
                  <Route path="/*" element={<NotFoundPage />} />
                  <Route
                    path="chat-with-strangers"
                    element={<ChatWithStrangersPage />}
                  />
                  <Route path="conversations" element={<ConversationsPage />} />
                  <Route path="friends" element={<FriendsPage />} />
                  <Route path="home" element={<VentsPage />} />
                  <Route path="make-friends" element={<MakeFriendsPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="online-users" element={<OnlineUsersPage />} />
                  <Route path="popular" element={<VentsPage />} />
                  <Route
                    path="privacy-policy"
                    element={<PrivacyPolicyPage />}
                  />
                  <Route path="problem/:id" element={<VentPage />} />
                  <Route path="problem/:id/:title" element={<VentPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="recent" element={<VentsPage />} />
                  <Route path="rewards" element={<RewardsPage />} />
                  <Route path="rules" element={<RulesPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="site-info" element={<AboutUsPage />} />
                  <Route path="subscribe" element={<SubscribePage />} />
                  <Route
                    path="subscription-successful"
                    element={<SubSuccessPage />}
                  />
                  <Route path="trending" element={<VentsPage />} />
                  <Route path="vent-to-strangers" element={<NewVentPage />} />
                  <Route
                    path="vent-to-strangers/:id"
                    element={<NewVentPage />}
                  />
                  <Route
                    path="verified-email"
                    element={<VerifiedEmailPage />}
                  />
                </Routes>
              </Suspense>
            </Container>
            {newReward && (
              <NewRewardModal
                close={() => setNewReward(false)}
                newReward={newReward}
              />
            )}
          </Container>
        </Router>
      </OnlineUsersContext.Provider>
    </UserContext.Provider>
  );
}

export default RoutesComp;
