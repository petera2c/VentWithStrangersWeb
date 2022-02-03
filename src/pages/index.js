import React, { Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import loadable from "@loadable/component";
import { useIdleTimer } from "react-idle-timer";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { OnlineUsersContext, UserContext } from "../context";

const BirthdayModal = loadable(() => import("../components/modals/Birthday"));
const Container = loadable(() => import("../components/containers/Container"));
const Header = loadable(() => import("../components/Header"));
const LoadingHeart = loadable(() =>
  import("../components/views/loaders/Heart")
);
const MobileHeader = loadable(() =>
  import("../components/Header/MobileHeader")
);
const NewRewardModal = loadable(() => import("../components/modals/NewReward"));
const Sidebar = loadable(() => import("../components/Sidebar"));

const AboutUsPage = React.lazy(() => import("./AboutUs"));
const AccountPage = React.lazy(() => import("./Account/Account"));
const AvatarPage = React.lazy(() => import("./Account/Avatar"));
const BirthdayPostPage = React.lazy(() => import("./BirthdayPost"));
const ChatWithStrangersPage = React.lazy(() => import("./ChatWithStrangers"));
const ConversationsPage = React.lazy(() => import("./Conversations"));
const MakeFriendsPage = React.lazy(() => import("./MakeFriends"));
const NewVentPage = React.lazy(() => import("./NewVent"));
const NotFoundPage = React.lazy(() => import("./NotFound"));
const NotificationsPage = React.lazy(() => import("./Notifications"));
const OnlineUsersPage = React.lazy(() => import("./OnlineUsers"));
const PrivacyPolicyPage = React.lazy(() => import("./PrivacyPolicy"));
const ProfilePage = React.lazy(() => import("./Account/Profile"));
const QuoteContestPage = React.lazy(() => import("./QuoteContest"));
const RewardsPage = React.lazy(() => import("./Rewards"));
const RulesPage = React.lazy(() => import("./Rules"));
const TagsIndividualPage = React.lazy(() => import("./tags/Individual"));
const TagsPage = React.lazy(() => import("./tags/All"));
const SearchPage = React.lazy(() => import("./Search"));
const SettingsPage = React.lazy(() => import("./Account/Settings"));
const SignUpPage = React.lazy(() => import("./SignUp"));
const SubscribePage = React.lazy(() => import("./Subscribe"));
const SubSuccessPage = React.lazy(() => import("./SubscriptionSuccess"));
const VentPage = React.lazy(() => import("./Vent"));
const VentsPage = React.lazy(() => import("./Vents"));
const VerifiedEmailPage = React.lazy(() => import("./EmailAuth/VerifiedEmail"));

function RoutesComp() {
  const isMounted = useRef(false);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [isUsersBirthday, setIsUsersBirthday] = useState(false);
  const [newReward, setNewReward] = useState();
  const [totalOnlineUsers, setTotalOnlineUsers] = useState();
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [userSubscription, setUserSubscription] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState();

  onAuthStateChanged(getAuth(), (user) => {
    setLoading(false);
    if (user) setUser(user);
    else {
      setUser(false);
    }
  });

  const handleOnIdle = (event) => {
    if (user && user.uid)
      import("./util").then((functions) => {
        functions.setUserOnlineStatus("offline", user.uid);
      });
  };

  const handleOnActive = (event) => {
    if (user && user.uid)
      import("./util").then((functions) => {
        functions.setUserOnlineStatus("online", user.uid);
      });
  };

  const handleOnAction = (event) => {
    if (user && user.uid)
      import("./util").then((functions) => {
        functions.setUserOnlineStatus("online", user.uid);
      });
  };

  useIdleTimer({
    timeout: 1000 * 60 * 480,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 5000,
  });

  useEffect(() => {
    isMounted.current = true;

    let newRewardListenerUnsubscribe;
    import("../util").then((functions) => {
      setIsMobileOrTablet(functions.getIsMobileOrTablet());
    });

    if (user) {
      import("./util").then((functions) => {
        newRewardListenerUnsubscribe = functions.newRewardListener(
          isMounted,
          setNewReward,
          user.uid
        );
        functions.getIsUsersBirthday(isMounted, setIsUsersBirthday, user.uid);
        functions.getIsUserSubscribed(setUserSubscription, user.uid);
        functions.setIsUserOnlineToDatabase(user.uid);
      });

      import("../util").then((functions) => {
        functions.getUserBasicInfo((newBasicUserInfo) => {
          setUserBasicInfo(newBasicUserInfo);
        }, user.uid);
      });
    }

    return () => {
      isMounted.current = false;
      if (newRewardListenerUnsubscribe) newRewardListenerUnsubscribe();
      if (user)
        import("./util").then((functions) => {
          functions.setUserOnlineStatus("offline", user.uid);
        });
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
          <Container className="screen-container column">
            {!isMobileOrTablet && <Header />}
            {isMobileOrTablet && <MobileHeader />}
            <Container className="flex-fill ov-hidden">
              {!isMobileOrTablet && <Sidebar />}

              {!loading && (
                <Suspense
                  fallback={
                    <Container className="flex-fill justify-center bg-grey-2">
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
                    <Route path="chat" element={<ConversationsPage />} />
                    <Route path="make-friends" element={<MakeFriendsPage />} />
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
                    <Route path="site-info" element={<AboutUsPage />} />
                    <Route path="subscribe" element={<SubscribePage />} />
                    <Route
                      path="subscription-successful"
                      element={<SubSuccessPage />}
                    />
                    <Route path="tags" element={<TagsPage />} />
                    <Route
                      path="tags/:tagID"
                      element={<TagsIndividualPage />}
                    />

                    <Route path="trending" element={<VentsPage />} />
                    <Route path="vent-to-strangers" element={<NewVentPage />} />
                    <Route
                      path="vent-to-strangers/:id"
                      element={<NewVentPage />}
                    />
                    <Route path="vent/:id" element={<VentPage />} />
                    <Route path="vent/:id/:title" element={<VentPage />} />
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

export default RoutesComp;
