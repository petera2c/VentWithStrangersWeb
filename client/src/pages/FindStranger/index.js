import React, { Component } from "react";
import axios from "axios";

import Consumer, { ExtraContext } from "../../context";

import Chat from "../../components/Chat/";
import Loader from "../../components/notifications/Loader/";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIText from "../../components/views/GIText";

import { findConversation, initUserJoined } from "./util";

import "./style.css";

class JoinConversation extends Component {
  state = {
    chatPartner: undefined,
    conversation: undefined,
    conversationsWithListener: [],
    conversationsWithVenter: [],
    listener: false,
    saving: true,
    venter: false
  };
  componentDidMount() {
    this._ismounted = true;
    const { socket } = this.context;
    if (socket) {
      initUserJoined(this.handleChange, socket);
      socket.on("users_waiting", stateObj => {
        this.handleChange(stateObj);
      });
    }
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };
  render() {
    const {
      chatPartner,
      conversation,
      conversationsWithListener,
      conversationsWithVenter,
      listener,
      saving,
      venter
    } = this.state;

    return (
      <Consumer>
        {context => (
          <Page
            className="full-screen column full-center"
            description="Vent with strangers :)"
            keywords="Vent, strangers, help"
            title="Find Stranger"
          >
            <GIText
              text={`Listeners waiting: ${conversationsWithListener.length}`}
              type="h4"
            />

            <GIText
              text={`Venters waiting: ${conversationsWithVenter.length}`}
              type="h4"
            />
            {context.user && !conversation && (
              <GIContainer className="center-container">
                <GIContainer
                  className="option-container pa64"
                  onClick={() => {
                    this.handleChange({ conversation: true });
                    findConversation(context.socket, "listener");
                  }}
                >
                  Help a Stranger
                </GIContainer>
                <GIContainer
                  className="option-container pa64"
                  onClick={() => {
                    this.handleChange({ conversation: true });
                    findConversation(context.socket, "venter");
                  }}
                >
                  Vent to a Stranger
                </GIContainer>
              </GIContainer>
            )}
            {conversation && (
              <GIContainer className="">
                <Chat chatPartner={chatPartner} conversation={conversation} />
              </GIContainer>
            )}
          </Page>
        )}
      </Consumer>
    );
  }
}
JoinConversation.contextType = ExtraContext;

export default JoinConversation;
