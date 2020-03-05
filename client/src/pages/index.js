import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { Route, Switch, withRouter } from "react-router-dom";

import Consumer, { ExtraContext } from "../context";

import LoadingHeart from "../components/loaders/Heart";
import Container from "../components/containers/Container";

import Header from "../components/Header";
import MobileHeader from "../components/Header/MobileHeader";

import AccountPage from "./Account";
import SearchPage from "./Search";
import ProblemsPage from "./Problems";
import FindStrangerPage from "./FindStranger";
import NewProblemPage from "./NewProblem";
import ProblemPage from "./Problem";
import HotTagsPage from "./HotTags";
import NotFoundPage from "./NotFound";

import { searchProblems } from "./Search/util";
import { isMobileOrTablet } from "../util";
import {
  getNotifications,
  getUsersComments,
  getUsersPosts,
  initSocket
} from "./util";

class Routes extends Component {
  state = {
    databaseConnection: false
  };
  componentDidMount() {
    const { handleChange, notify } = this.context;

    axios.get("/api/user").then(res => {
      const { success, user, message } = res.data;

      if (success) {
        initSocket(stateObj => {
          handleChange({ ...stateObj, user });
          this.setState({ databaseConnection: true });
          this.getDataNeededForPage(this.props.location, undefined, true);
          stateObj.socket.emit("set_user_id");
          if (user.password) {
            getNotifications(0, stateObj.socket);
            this.initReceiveNotifications();
          }
        });
      } else {
        notify({ message, type: "danger" });
      }
    });

    this.unlisten = this.props.history.listen(this.getDataNeededForPage);
  }
  componentWillUnmount() {
    this.unlisten();
  }
  getDataNeededForPage = (location, action, initialPageLoad) => {
    let { pathname, search } = location;
    const { getProblems, handleChange, notify, socket } = this.context; // Functions
    const { problems, skip, user } = this.context; // Variables

    handleChange({ problems: undefined, skip: 0 }, () => {
      search = search.slice(1, search.length);

      if (
        pathname.substring(0, 8) === "/popular" ||
        pathname.substring(0, 7) === "/recent" ||
        pathname.substring(0, 9) === "/trending"
      )
        getProblems(pathname, search);
      else if (pathname === "/") getProblems("/trending", search);
      else if (pathname.substring(0, 5) === "/home")
        getProblems("/trending", search);
      else if (pathname === "/search")
        searchProblems(handleChange, undefined, search, skip, socket);
      else if (pathname === "/activity") {
        getUsersPosts(
          handleChange,
          notify,
          problems,
          search,
          skip,
          socket,
          user
        );
        getUsersComments(handleChange, notify, search, socket, user);
      }
    });
  };

  initReceiveNotifications = () => {
    const { socket } = this.context;
    socket.on("receive_new_notifications", dataObj => {
      const { handleChange } = this.context; // Functions
      const { notifications } = this.context; // Variables
      const { newNotifications } = dataObj;

      if (notifications.length > 0) {
        if (newNotifications && newNotifications.length > 0) {
          if (
            moment(newNotifications[0].createdAt) <
            moment(notifications[0].createdAt)
          )
            handleChange({
              notifications: notifications.concat(newNotifications)
            });
          else
            handleChange({
              notifications: newNotifications.concat(notifications)
            });
        }
      } else handleChange({ notifications: newNotifications });
    });
  };
  render() {
    const { databaseConnection } = this.state;
    const { pathname } = this.props.location;

    if (!databaseConnection)
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
        {context => (
          <Container
            className="screen-container column"
            style={{
              maxHeight: pathname === "/vent-to-a-stranger" ? "100vh" : "auto"
            }}
          >
            {!isMobileOrTablet() && <Header />}
            {isMobileOrTablet() && <MobileHeader />}
            <Switch>
              <Route path="/account/" component={AccountPage} exact />
              <Route path="/activity/" component={AccountPage} />
              <Route path="/settings/" component={AccountPage} exact />
              <Route path="/search/" component={SearchPage} />
              <Route path="/hot-tags/" component={HotTagsPage} />
              <Route path="/" component={ProblemsPage} exact />
              <Route path="/home/" component={ProblemsPage} />
              <Route path="/trending/" component={ProblemsPage} />
              <Route path="/recent/" component={ProblemsPage} />
              <Route path="/popular/" component={ProblemsPage} />
              <Route path="/vent-to-a-stranger/" component={FindStrangerPage} />
              <Route path="/post-a-problem/" component={NewProblemPage} />
              <Route path="/problem/" component={ProblemPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Container>
        )}
      </Consumer>
    );
  }
}
Routes.contextType = ExtraContext;

export default withRouter(Routes);
