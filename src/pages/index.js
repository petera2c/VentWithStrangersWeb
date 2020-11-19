import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import Consumer, { UserContext } from "../context";

import Container from "../components/containers/Container";

import Header from "../components/Header";
import MobileHeader from "../components/Header/MobileHeader";
import LoadingHeart from "../components/loaders/Heart";

import AccountPage from "./Account";
import AppDownloadPage from "./AppDownload";
import NotificationsPage from "./Notifications";
import SearchPage from "./Search";
import VentsPage from "./Vents";
import ChatsPage from "./Conversations";
import ChatWithStrangerPage from "./ChatWithStranger";
import NewVentPage from "./NewVent";
import VentPage from "./Vent";
import BlogPage from "./Blog";
import CreateBlogPage from "./CreateBlog";
import NotFoundPage from "./NotFound";
import PrivacyPolicyPage from "./PrivacyPolicy";

import { GIProvider } from "../context";

import { isMobileOrTablet } from "../util";

function Routes() {
  const [user, loading, error] = useAuthState(firebase.auth());
  /*
  const db = firebase.firestore();
  const test2 = db.collection("cities").doc("LA").set({
    here: "true",
  });*/

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
    <GIProvider>
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
                <Route path="/account/" component={AccountPage} exact />
                <Route path="/app-downloads/" component={AppDownloadPage} />
                <Route path="/activity/" component={AccountPage} />
                <Route path="/settings/" component={AccountPage} exact />
                <Route path="/notifications/" component={NotificationsPage} />
                <Route path="/search/" component={SearchPage} />
                <Route path="/" component={VentsPage} exact />
                <Route path="/home/" component={VentsPage} />
                <Route path="/trending/" component={VentsPage} />
                <Route path="/recent/" component={VentsPage} />
                <Route path="/popular/" component={VentsPage} />
                <Route path="/chats/" component={ChatsPage} />
                <Route
                  path="/vent-to-a-stranger/"
                  component={ChatWithStrangerPage}
                />
                <Route path="/post-a-problem/" component={NewVentPage} />
                <Route path="/problem/" component={VentPage} />
                <Route path="/blog/" component={BlogPage} />
                <Route path="/create-blog/" component={CreateBlogPage} />
                <Route path="/privacy-policy/" component={PrivacyPolicyPage} />
                <Route component={NotFoundPage} />
              </Switch>
            )}
            <div id="sound"></div>
          </Container>
        </Router>
      </UserContext.Provider>
    </GIProvider>
  );
}

export default Routes;
