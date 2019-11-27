import React, { Component } from "react";
import axios from "axios";

import Consumer, { ExtraContext } from "../../context";

import Chat from "../../components/Chat/";
import Loader from "../../components/notifications/Loader/";

import Page from "../../components/containers/Page";
import VWSContainer from "../../components/containers/VWSContainer";
import VWSText from "../../components/views/VWSText";

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
            className="column bg-grey align-center"
            description="Vent with strangers :)"
            keywords="Vent, strangers, help"
            title="Find Stranger"
          >
            <VWSContainer className="container-box large column mt16">
              <VWSText className="py16" text="Vent with a Stranger" type="h4" />
              {context.user && !conversation && (
                <VWSContainer className="center-container">
                  <VWSContainer
                    className="column option-container pa64"
                    onClick={() => {
                      this.handleChange({ conversation: true });
                      findConversation(context.socket, "listener");
                    }}
                  >
                    Help a Stranger
                    <VWSText text="Listeners Waiting" type="p" />
                    <VWSText text={conversationsWithListener.length} type="p" />
                  </VWSContainer>
                  <VWSContainer
                    className="column option-container pa64"
                    onClick={() => {
                      this.handleChange({ conversation: true });
                      findConversation(context.socket, "venter");
                    }}
                  >
                    Vent to a Stranger
                    <VWSText text="Venters Waiting" type="p" />
                    <VWSText text={conversationsWithVenter.length} type="p" />
                  </VWSContainer>
                </VWSContainer>
              )}
              {conversation && (
                <VWSContainer className="">
                  <Chat chatPartner={chatPartner} conversation={conversation} />
                </VWSContainer>
              )}
            </VWSContainer>
          </Page>
        )}
      </Consumer>
    );
  }
}
JoinConversation.contextType = ExtraContext;

export default JoinConversation;
