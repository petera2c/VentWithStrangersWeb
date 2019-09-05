import React, { Component } from "react";
import axios from "axios";
import { Route, Switch, withRouter } from "react-router-dom";

import Consumer, { ExtraContext } from "../context";

import Loader from "../components/notifications/Loader";
import GIContainer from "../components/containers/GIContainer";

import JoinConversationPage from "./JoinConversation";

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
          <GIContainer className="main-wrapper">
            <Header />
            <Switch>
              <Route path="/dashboard/" component={JoinConversationPage} />
              <Route component={JoinConversationPage} />
            </Switch>
          </GIContainer>
        )}
      </Consumer>
    );
  }
}
Routes.contextType = ExtraContext;

export default withRouter(Routes);
