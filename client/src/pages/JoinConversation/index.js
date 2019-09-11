import React, { Component } from "react";
import axios from "axios";

import Consumer, { ExtraContext } from "../../context";

import Chat from "../../components/Chat/";
import Loader from "../../components/notifications/Loader/";

import Page from "../../components/containers/Page";

import { findConversation, initUserJoined } from "./util";

import "./style.css";

class JoinConversation extends Component {
  state = {
    conversation: undefined,
    listener: false,
    saving: true,
    venter: false
  };
  componentDidMount() {
    const { socket } = this.context;
    initUserJoined(this.handleChange, socket);
  }

  handleChange = stateObj => {
    this.setState(stateObj);
  };
  render() {
    const { conversation, listener, saving, venter } = this.state;

    return (
      <Consumer>
        {context => (
          <Page
            className="full-center full-screen"
            description="Vent with strangers :)"
            keywords="Vent, strangers, help"
            title="Home"
          >
            {context.user && !conversation && (
              <div className="center-container">
                <div
                  className="option-container"
                  onClick={() => {
                    this.handleChange({ conversation: true });
                    findConversation(context.socket, "listener");
                  }}
                >
                  Help a Stranger
                </div>
                <div
                  className="option-container"
                  onClick={() => {
                    this.handleChange({ conversation: true });
                    findConversation(context.socket, "venter");
                  }}
                >
                  Vent to a Stranger
                </div>
              </div>
            )}
            {conversation && (
              <div className="center-container">
                <Chat conversation={conversation} />
              </div>
            )}
          </Page>
        )}
      </Consumer>
    );
  }
}
JoinConversation.contextType = ExtraContext;

export default JoinConversation;
