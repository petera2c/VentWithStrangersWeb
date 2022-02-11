import React, { Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import loadable from "@loadable/component";
import { useIdleTimer } from "react-idle-timer";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { OnlineUsersContext, UserContext } from "../context";

import Container from "../components/containers/Container";
import LoadingHeart from "../components/views/loaders/Heart";

const BirthdayModal = loadable(() => import("../components/modals/Birthday"));
const Header = loadable(() => import("../components/Header"));
const MobileHeader = loadable(() =>
  import("../components/Header/MobileHeader")
);
const NewRewardModal = loadable(() => import("../components/modals/NewReward"));
const Sidebar = loadable(() => import("../components/Sidebar"));

const NotFoundPage = React.lazy(() => import("./Basic/NotFound"));
const PrivacyPolicyPage = React.lazy(() => import("./Basic/PrivacyPolicy"));
const RulesPage = React.lazy(() => import("./Basic/Rules"));
const SiteInfoPage = React.lazy(() => import("./Basic/SiteInfo"));
const VerifiedEmailPage = React.lazy(() => import("./Basic/VerifiedEmail"));

const AccountPage = React.lazy(() => import("./Account/Account"));
const AvatarPage = React.lazy(() => import("./Account/Avatar"));
const NotificationsPage = React.lazy(() => import("./Account/Notifications"));
const ProfilePage = React.lazy(() => import("./Account/Profile"));
const SettingsPage = React.lazy(() => import("./Account/Settings"));

const BirthdayPostPage = React.lazy(() => import("./NewVent/BirthdayPost"));
const NewVentPage = React.lazy(() => import("./NewVent"));

const ChatWithStrangersPage = React.lazy(() => import("./ChatWithStrangers"));
const ConversationsPage = React.lazy(() => import("./Conversations"));
const MakeFriendsPage = React.lazy(() => import("./MakeFriends"));
const OnlineUsersPage = React.lazy(() => import("./OnlineUsers"));
const RewardsPage = React.lazy(() => import("./Rewards"));

const QuoteContestPage = React.lazy(() => import("./QuoteContest"));
const TopQuotesMonthPage = React.lazy(() =>
  import("./QuoteContest/TopQuotesMonth")
);

const TagsIndividualPage = React.lazy(() => import("./tags/Individual"));
const TagsPage = React.lazy(() => import("./tags/All"));

const SearchPage = React.lazy(() => import("./Search"));
const SignUpPage = React.lazy(() => import("./SignUp"));
const SubscribePage = React.lazy(() => import("./Subscribe"));
const SubSuccessPage = React.lazy(() => import("./Subscribe/Success"));

const IndividualVentPage = React.lazy(() => import("./Vents/Individual"));
const VentsPage = React.lazy(() => import("./Vents"));

function RoutesComp() {
  const isMounted = useRef(false);

  const [firstOnlineUsers, setFirstOnlineUsers] = useState([]);
  const [isUsersBirthday, setIsUsersBirthday] = useState(false);
  const [newReward, setNewReward] = useState();
  const [totalOnlineUsers, setTotalOnlineUsers] = useState();
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [userSubscription, setUserSubscription] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  onAuthStateChanged(getAuth(), (user) => {
    if (!isMounted.current) return;
    setLoading(false);

    if (user) setUser(user);
  });

  const handleOnIdle = (event) => {
    if (user && user.uid) {
      import("./util").then((functions) => {
        functions.setUserOnlineStatus("offline", user.uid);
      });
    }
  };

  const handleOnActive = (event) => {
    if (user && user.uid) {
      import("./util").then((functions) => {
        functions.setUserOnlineStatus("online", user.uid);
      });
    }
  };

  const handleOnAction = (event) => {
    if (user && user.uid) {
      import("./util").then(async (functions) => {
        await functions.setUserOnlineStatus("online", user.uid);
        import("../util").then(async (functions) => {
          functions.getTotalOnlineUsers((totalOnlineUsers) => {
            if (isMounted.current) {
              setTotalOnlineUsers(totalOnlineUsers);
              functions.getUserAvatars(
                () => isMounted.current,
                (firstOnlineUsers) => {
                  if (isMounted.current) setFirstOnlineUsers(firstOnlineUsers);
                }
              );
            }
          });
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

    let newRewardListenerUnsubscribe;
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
        functions.getUserBasicInfo((newBasicUserInfo) => {
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
                    <Route path="chat" element={<ConversationsPage />} />
                    <Route
                      path="feel-good-quotes-month"
                      element={<TopQuotesMonthPage />}
                    />
                    <Route path="make-friends" element={<MakeFriendsPage />} />
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
                      element={<SubSuccessPage />}
                    />
                    <Route path="tags" element={<TagsPage />} />
                    <Route
                      path="tags/:tagID"
                      element={<TagsIndividualPage />}
                    />
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

export default RoutesComp;
