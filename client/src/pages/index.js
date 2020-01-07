import React, { Component } from "react";
import axios from "axios";
import { Route, Switch, withRouter } from "react-router-dom";

import Consumer, { ExtraContext } from "../context";

import Loader from "../components/notifications/Loader";
import Container from "../components/containers/Container";

import AccountPage from "./Account";
import SearchPage from "./Search";
import TrendingPage from "./Trending";
import PopularPage from "./Popular";
import RecentPage from "./Recent";
import FindStrangerPage from "./FindStranger";
import NewProblemPage from "./NewProblem";
import ProblemPage from "./Problem";
import NotFoundPage from "./NotFound";

import Header from "../components/Header";

import { initSocket } from "./util";

class Routes extends Component {
  state = {
    datebaseConnection: false
  };
  componentDidMount() {
    const { handleChange } = this.context;

    axios.get("/api/user").then(res => {
      const { success, user, message } = res.data;

      if (success) {
        initSocket(stateObj => {
          handleChange({ ...stateObj, user });
          this.setState({ datebaseConnection: true });
          this.getDataNeededForPage(this.props.location);
        });
      } else {
        alert("Can't get user");
      }
    });

    this.unlisten = this.props.history.listen(this.getDataNeededForPage);
  }
  getDataNeededForPage = (location, action) => {
    let { pathname, search } = location;
    const { getProblems, handleChange, socket } = this.context;

    search = search.slice(1, search.length);

    if (
      pathname === "/popular" ||
      pathname === "/recent" ||
      pathname === "/trending"
    )
      getProblems(pathname, search);
    else if (pathname === "/search")
      socket.emit("search_problems", search, problems => {
        handleChange({ problems });
      });
  };
  createProblemPages = problems => {
    return;
    return problems.map((problem, index) => (
      <Route
        path={"/problems/" + problem.title + "/"}
        key={index}
        render={props => <ProblemPage problem={problem} />}
      />
    ));
  };
  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { datebaseConnection } = this.state;

    if (!datebaseConnection) return <Loader />;

    return (
      <Consumer>
        {context => (
          <Container className="column full-screen">
            <Header />
            <Switch>
              <Route path="/account/" component={AccountPage} />
              <Route path="/activity/" component={AccountPage} />
              <Route path="/settings/" component={AccountPage} />
              <Route path="/search/" component={SearchPage} />
              <Route path="/trending/" component={TrendingPage} />
              <Route path="/" component={TrendingPage} />
              <Route path="/recent/" component={RecentPage} />
              <Route path="/popular/" component={PopularPage} />
              <Route path="/vent-to-a-stranger/" component={FindStrangerPage} />
              <Route path="/post-a-problem/" component={NewProblemPage} />
              {this.createProblemPages(context.problems)}
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
