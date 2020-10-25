import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { Route, Switch, withRouter } from "react-router-dom";
import Cookies from "universal-cookie";

import Consumer, { ExtraContext } from "../context";

import LoadingHeart from "../components/loaders/Heart";
import Container from "../components/containers/Container";

import Header from "../components/Header";
import MobileHeader from "../components/Header/MobileHeader";
import CookiesComponent from "../components/Cookies";

import AccountPage from "./Account";
import AppDownloadPage from "./AppDownload";
import NotificationsPage from "./Notifications";
import SearchPage from "./Search";
import VentsPage from "./Vents";
import ChatsPage from "./Conversations";
import ChatWithStrangerPage from "./ChatWithStranger";
import NewVentPage from "./NewVent";
import VentPage from "./Vent";
import HotTagsPage from "./HotTags";
import BlogPage from "./Blog";
import CreateBlogPage from "./CreateBlog";
import NotFoundPage from "./NotFound";
import PrivacyPolicyPage from "./PrivacyPolicy";

import { searchVents } from "./Search/util";
import { isMobileOrTablet } from "../util";
import {
  getNotifications,
  getUsersComments,
  getUsersPosts,
  initReceiveNotifications,
  initSocket,
} from "./util";

const cookies = new Cookies();

class Routes extends Component {
  state = {
    hasVisitedSite: true,
  };

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { hasVisitedSite } = this.state;
    const { pathname } = this.props.location;
    const { user } = this.context;

    if (user === undefined)
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
      <Consumer>
        {(context) => (
          <Container
            className="screen-container column"
            style={{
              maxHeight: pathname === "/vent-to-a-stranger" ? "100vh" : "auto",
            }}
          >
            {!isMobileOrTablet() && <Header />}
            {isMobileOrTablet() && <MobileHeader />}
            <Switch>
              <Route path="/account/" component={AccountPage} exact />
              <Route path="/app-downloads/" component={AppDownloadPage} />
              <Route path="/activity/" component={AccountPage} />
              <Route path="/settings/" component={AccountPage} exact />
              <Route path="/notifications/" component={NotificationsPage} />
              <Route path="/search/" component={SearchPage} />
              <Route path="/hot-tags/" component={HotTagsPage} />
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
            {!hasVisitedSite && (
              <CookiesComponent
                accept={() => {
                  cookies.set("hasVisitedSite", true);
                  this.setState({ hasVisitedSite: true });
                }}
              />
            )}
            <div id="sound"></div>
          </Container>
        )}
      </Consumer>
    );
  }
}
Routes.contextType = ExtraContext;

export default withRouter(Routes);
