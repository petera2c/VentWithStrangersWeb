import React, { Component } from "react";
import axios from "axios";
import { Route, Switch, withRouter } from "react-router-dom";

import Consumer, { ExtraContext } from "../context";

import Loader from "../components/notifications/Loader";
import GIContainer from "../components/containers/GIContainer";

import HomePage from "./Home";
import FindStrangerPage from "./FindStranger";
import NewProblemPage from "./NewProblem";
import SignInPage from "./SignIn";
import SignUpPage from "./SignUp";

import Header from "../components/Header";

import { initSocket } from "./util";

class Routes extends Component {
  state = {
    datebaseConnection: false
  };
  componentDidMount() {
    axios.get("/api/user").then(res => {
      const { success, user, message } = res.data;
      const { handleChange } = this.context;

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
              <Route path="/new-conversation/" component={FindStrangerPage} />
              <Route path="/sign-in/" component={SignInPage} />
              <Route path="/sign-up/" component={SignUpPage} />
              <Route path="/home/" component={HomePage} />
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
