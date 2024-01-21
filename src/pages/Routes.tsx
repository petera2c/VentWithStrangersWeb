import { Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { OnlineUsersContext, UserContext } from "../context";

import Container from "../components/containers/Container";
import LoadingHeart from "../components/views/loaders/Heart";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import SignUpPage from "./SignUpPage";
import NotFoundPage from "./Basic/NotFoundPage";
import VentsPage from "./Vents/VentsPage";
import ChatWithStrangersPage from "./ChatWithStrangers/ChatWithStrangersPage";
import { setUserOnlineStatus } from "./util";
import AccountPage from "./Account/AccountPage";
import SettingsPage from "./Account/SettingsPage";
import AvatarPage from "./Account/Avatar/AvatarPage";
import BirthdayPostPage from "./NewVent/BirthdayPostPage";
import ConversationsPageMobile from "./Conversations/ConversationsPageMobile";
import TopQuotesMonthPage from "./QuoteContest/TopQuotesMonth/TopQuotesMonthPage";
import NotificationsPage from "./Account/NotificationsPage";
import OnlineUsersPage from "./OnlineUsers/OnlineUsersPage";
import PrivacyPolicyPage from "./Basic/PrivacyPolicyPage";
import ProfilePage from "./Account/ProfilePage";
import QuoteContestPage from "./QuoteContest/QuoteContestPage";
import RewardsPage from "./Rewards/RewardsPage";
import RulesPage from "./Basic/RulesPage";
import SearchPage from "./Search/SearchPage";
import SiteInfoPage from "./Basic/SiteInfoPage";
import SubscribePage from "./Subscribe/SubscribePage";
import SubscriptionSuccessPage from "./Subscribe/SubscriptionsSuccessPage";
import AllTagsPage from "./tags/All/AllTagsPage";
import IndividualTagPage from "./tags/Individual/IndividualTagPage";
import NewVentPage from "./NewVent/NewVentPage";
import IndividualVentPage from "./Vents/Individual/IndividualVentPage";
import VerifiedEmailPage from "./Basic/VerifiedEmail/VerifiedEmailPage";
import NewRewardModal from "../components/modals/NewReward";
import BirthdayModal from "../components/modals/Birthday";
import MobileHeader from "../components/Header/MobileHeader";
import { getTotalOnlineUsers, getUserAvatars } from "../util";

function AppRoutes() {
  const isMounted = useRef(false);

  const [firstOnlineUsers, setFirstOnlineUsers] = useState([]);
  const [isUsersBirthday, setIsUsersBirthday] = useState(false);
  const [newReward, setNewReward] = useState<any>();
  const [totalOnlineUsers, setTotalOnlineUsers] = useState<any>();
  const [userBasicInfo, setUserBasicInfo] = useState<any>({});
  const [userSubscription, setUserSubscription] = useState<any>();
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState<any>(true);

  onAuthStateChanged(getAuth(), (user) => {
    if (!isMounted.current) return;
    if (loading) setLoading(false);

    if (user) setUser(user);
    else {
      setUser(undefined);
      setUserSubscription(undefined);
      if (userBasicInfo.displayName) setUserBasicInfo({});
    }
  });

  const handleOnIdle = () => {
    if (user && user.uid) {
      import("./util").then((functions) => {
        functions.setUserOnlineStatus("offline", user.uid);
      });
    }
  };

  const handleOnActive = () => {
    if (user && user.uid) {
      import("./util").then((functions) => {
        functions.setUserOnlineStatus("online", user.uid);
      });
    }
  };

  const handleOnAction = () => {
    if (user && user.uid) {
      setUserOnlineStatus("online", user.uid);
      getTotalOnlineUsers((totalOnlineUsers: any) => {
        setTotalOnlineUsers(totalOnlineUsers);
        getUserAvatars((firstOnlineUsers: any) => {
          setFirstOnlineUsers(firstOnlineUsers);
        });
      });
    }
  };

  useIdleTimer({
    onAction: handleOnAction,
    onActive: handleOnActive,
    onIdle: handleOnIdle,
    throttle: 10000,
    timeout: 1000 * 60 * 480,
  });

  useEffect(() => {
    isMounted.current = true;

    let newRewardListenerUnsubscribe: any;
    if (user) {
      import("./util").then((functions) => {
        newRewardListenerUnsubscribe = functions.newRewardListener(
          isMounted,
          setNewReward,
          user.uid
        );
        functions.getIsUsersBirthday(isMounted, setIsUsersBirthday, user.uid);
        functions.getIsUserSubscribed(isMounted, setUserSubscription, user.uid);
        functions.setIsUserOnlineToDatabase(user.uid);
      });

      import("../util").then((functions) => {
        functions.getUserBasicInfo((newBasicUserInfo: any) => {
          if (isMounted.current) setUserBasicInfo(newBasicUserInfo);
        }, user.uid);
      });
    }

    return () => {
      isMounted.current = false;

      if (newRewardListenerUnsubscribe) newRewardListenerUnsubscribe();
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
          firstOnlineUsers,
          setFirstOnlineUsers,
          setTotalOnlineUsers,
          totalOnlineUsers,
        }}
      >
        <Router>
          <Container className="screen-container column">
            {!(window.screen.width < 940) && <Header />}
            {window.screen.width < 940 && <MobileHeader />}

            <Container className="flex-fill ov-hidden">
              {!(window.screen.width < 940) && <Sidebar />}

              {!loading && (
                <Suspense
                  fallback={
                    <Container className="flex-fill justify-center bg-blue-2">
                      <LoadingHeart />
                    </Container>
                  }
                >
                  <Routes>
                    {!user && <Route path="account" element={<SignUpPage />} />}
                    {user && <Route path="account" element={<AccountPage />} />}
                    {!user && <Route path="avatar" element={<SignUpPage />} />}
                    {!user && (
                      <Route path="settings" element={<SignUpPage />} />
                    )}
                    {user && (
                      <Route path="settings" element={<SettingsPage />} />
                    )}
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/" element={<VentsPage />} />
                    <Route path="avatar" element={<AvatarPage />} />
                    <Route
                      path="birthday-post"
                      element={<BirthdayPostPage />}
                    />
                    <Route
                      path="chat-with-strangers"
                      element={<ChatWithStrangersPage />}
                    />
                    <Route path="chat" element={<ConversationsPageMobile />} />
                    <Route
                      path="feel-good-quotes-month"
                      element={<TopQuotesMonthPage />}
                    />
                    <Route path="my-feed" element={<VentsPage />} />
                    <Route
                      path="notifications"
                      element={<NotificationsPage />}
                    />
                    <Route path="people-online" element={<OnlineUsersPage />} />
                    <Route
                      path="privacy-policy"
                      element={<PrivacyPolicyPage />}
                    />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route
                      path="quote-contest"
                      element={<QuoteContestPage />}
                    />
                    <Route path="recent" element={<VentsPage />} />
                    <Route path="rewards" element={<RewardsPage />} />
                    <Route path="rules" element={<RulesPage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="site-info" element={<SiteInfoPage />} />
                    <Route path="subscribe" element={<SubscribePage />} />
                    <Route
                      path="subscription-successful"
                      element={<SubscriptionSuccessPage />}
                    />
                    <Route path="tags" element={<AllTagsPage />} />
                    <Route path="tags/:tagID" element={<IndividualTagPage />} />
                    <Route path="trending" element={<VentsPage />} />
                    <Route path="trending/this-week" element={<VentsPage />} />
                    <Route path="trending/this-month" element={<VentsPage />} />
                    <Route path="vent-to-strangers" element={<NewVentPage />} />
                    <Route
                      path="vent-to-strangers/:id"
                      element={<NewVentPage />}
                    />
                    <Route path="vent/:id" element={<IndividualVentPage />} />
                    <Route
                      path="vent/:id/:title"
                      element={<IndividualVentPage />}
                    />
                    <Route
                      path="verified-email"
                      element={<VerifiedEmailPage />}
                    />
                  </Routes>
                </Suspense>
              )}
            </Container>
            {newReward && (
              <NewRewardModal
                close={() => setNewReward(false)}
                newReward={newReward}
              />
            )}
            {isUsersBirthday && (
              <BirthdayModal close={() => setIsUsersBirthday(false)} />
            )}
          </Container>
        </Router>
      </OnlineUsersContext.Provider>
    </UserContext.Provider>
  );
}

export default AppRoutes;
