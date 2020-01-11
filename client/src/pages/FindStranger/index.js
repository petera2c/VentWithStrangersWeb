import React, { Component } from "react";
import axios from "axios";

import Consumer, { ExtraContext } from "../../context";

import Chat from "../../components/Chat/";
import Loader from "../../components/notifications/Loader/";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

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
            className="column bg-grey align-center py32"
            description="Vent with strangers :)"
            keywords="vent, strangers, help"
            title="Vent or Help Now"
          >
            <Container className="container large column">
              <Text className="py16" text="Vent with a Stranger" type="h4" />
              {context.user && !conversation && (
                <Container className="center-container">
                  <Container
                    className="column option-container pa64"
                    onClick={() => {
                      this.handleChange({ conversation: true });
                      findConversation(context.socket, "listener");
                    }}
                  >
                    Help a Stranger
                    <Text text="Listeners Waiting" type="p" />
                    <Text text={conversationsWithListener.length} type="p" />
                  </Container>
                  <Container
                    className="column option-container pa64"
                    onClick={() => {
                      this.handleChange({ conversation: true });
                      findConversation(context.socket, "venter");
                    }}
                  >
                    Vent to a Stranger
                    <Text text="Venters Waiting" type="p" />
                    <Text text={conversationsWithVenter.length} type="p" />
                  </Container>
                </Container>
              )}
              {conversation && (
                <Container className="">
                  <Chat chatPartner={chatPartner} conversation={conversation} />
                </Container>
              )}
            </Container>
          </Page>
        )}
      </Consumer>
    );
  }
}
JoinConversation.contextType = ExtraContext;

export default JoinConversation;
