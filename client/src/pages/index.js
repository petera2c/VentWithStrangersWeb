import React, { Component } from "react";
import axios from "axios";
import { Route, Switch, withRouter } from "react-router-dom";

import Consumer, { ExtraContext } from "../context";

import Loader from "../components/notifications/Loader";
import VWSContainer from "../components/containers/VWSContainer";

import HomePage from "./Home";
import FindStrangerPage from "./FindStranger";
import NewProblemPage from "./NewProblem";
import ProblemPage from "./Problem";
import SignInPage from "./SignIn";
import SignUpPage from "./SignUp";
import NotFoundPage from "./NotFound";

import Header from "../components/Header";

import { getProblems, initSocket } from "./util";

class Routes extends Component {
  state = {
    datebaseConnection: false
  };
  componentDidMount() {
    const { handleChange } = this.context;

    axios.get("/api/user").then(res => {
      const { success, user, message } = res.data;

      getProblems(problems => {
        handleChange({ problems });
      });

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
  createProblemPages = (problems = []) => {
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
          <VWSContainer className="column full-screen">
            <Header />
            <Switch>
              <Route path="/trending/" component={HomePage} />
              <Route path="/recents/" component={HomePage} />
              <Route path="/popular/" component={HomePage} />
              <Route path="/random/" component={HomePage} />
              <Route path="/vent-to-a-stranger/" component={FindStrangerPage} />
              <Route path="/login/" component={SignInPage} />
              <Route path="/sign-up/" component={SignUpPage} />
              <Route path="/post-a-problem/" component={NewProblemPage} />
              {this.createProblemPages(context.problems)}
              <Route component={NotFoundPage} />
            </Switch>
          </VWSContainer>
        )}
      </Consumer>
    );
  }
}
Routes.contextType = ExtraContext;

export default withRouter(Routes);
