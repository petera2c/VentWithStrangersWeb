import React, { Component } from "react";
import axios from "axios";
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

import { isMobileOrTablet } from "../util";
import { initSocket } from "./util";

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
        });
      } else {
        notify({ message, type: "danger" });
      }
    });

    this.unlisten = this.props.history.listen(this.getDataNeededForPage);
  }
  getDataNeededForPage = (location, action, initialPageLoad) => {
    let { pathname, search } = location;
    const { getProblems, handleChange, skip, socket } = this.context;

    if (
      pathname + search ===
        this.props.location.pathname + this.props.location.search &&
      !initialPageLoad
    )
      return;

    handleChange({ problems: undefined, skip: 0 });

    search = search.slice(1, search.length);

    if (
      pathname === "/popular" ||
      pathname === "/recent" ||
      pathname === "/trending"
    )
      getProblems(pathname, search);
    else if (pathname === "/search")
      socket.emit("search_problems", search, skip, problems => {
        handleChange({ problems });
      });
    else if (pathname === "/") getProblems("/trending", search);
  };
  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { databaseConnection } = this.state;

    if (!databaseConnection)
      return (
        <Container className="x-fill justify-end pr32">
          <LoadingHeart />
        </Container>
      );

    return (
      <Consumer>
        {context => (
          <Container className="screen-container column">
            {!isMobileOrTablet() && <Header />}
            {isMobileOrTablet() && <MobileHeader />}
            <Switch>
              <Route path="/account/" component={AccountPage} exact />
              <Route path="/activity/" component={AccountPage} />
              <Route path="/settings/" component={AccountPage} exact />
              <Route path="/search/" component={SearchPage} />
              <Route path="/hot-tags/" component={HotTagsPage} />
              <Route path="/" component={ProblemsPage} exact />
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
