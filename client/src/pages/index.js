import React, { Component } from "react";
import axios from "axios";
import { Route, Switch, withRouter } from "react-router-dom";

import Consumer, { ExtraContext } from "../context";

import Loader from "../components/notifications/Loader";
import GIContainer from "../components/containers/GIContainer";

import HomePage from "./Home";
import FindStrangerPage from "./FindStranger";
import NewProblemPage from "./NewProblem";
import ProblemPage from "./Problem";
import SignInPage from "./SignIn";
import SignUpPage from "./SignUp";

import Header from "../components/Header";

import { getProblems, initSocket } from "./util";

class Routes extends Component {
  state = {
    datebaseConnection: false
  };
  componentDidMount() {
    const { handleChange } = this.context;

    getProblems(problems => {
      handleChange({ problems });
    });
    axios.get("/api/user").then(res => {
      const { success, user, message } = res.data;

      if (success) {
        initSocket(stateObj => {
          handleChange({ ...stateObj, user });
          this.setState({ datebaseConnection: true });
        });
      } else {
        alert("Can't get user");
      }
    });
  }
  createProblemPages = problems => {
    return problems.map((problem, index) => (
      <Route
        path={"/problems/" + problem.title + "/"}
        key={index}
        render={props => <ProblemPage problem={problem} />}
      />
    ));
  };

  render() {
    const { datebaseConnection } = this.state;

    if (!datebaseConnection) return <Loader />;

    return (
      <Consumer>
        {context => (
          <GIContainer
            className="column full-screen"
            style={{ backgroundColor: "var(--blue-color)" }}
          >
            <Header />
            <Switch>
              <Route path="/vent-to-a-stranger/" component={FindStrangerPage} />
              <Route path="/sign-in/" component={SignInPage} />
              <Route path="/sign-up/" component={SignUpPage} />
              <Route path="/post-a-problem/" component={NewProblemPage} />
              {this.createProblemPages(context.problems)}
              <Route component={HomePage} />
            </Switch>
          </GIContainer>
        )}
      </Consumer>
    );
  }
}
Routes.contextType = ExtraContext;

export default withRouter(Routes);
