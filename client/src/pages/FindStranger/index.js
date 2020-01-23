import React, { Component } from "react";
import axios from "axios";

import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
faWalkieTalkie;
import { faHandsHelping } from "@fortawesome/pro-duotone-svg-icons/faHandsHelping";
import { faWalkieTalkie } from "@fortawesome/pro-duotone-svg-icons/faWalkieTalkie";

import Chat from "../../components/Chat/";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import { isMobileOrTablet } from "../../util";
import { findConversation, initUserJoined } from "./util";

import "./style.css";

class ChatPage extends Component {
  state = {
    chatPartner: undefined,
    conversation: {
      messages: [],
      _id: "5e29f4f41ee1f7629c78868f",
      listener: "5e271d7c1ee1f7629c7885eb",
      createdAt: "2020-01-23T19:33:08.143Z",
      updatedAt: "2020-01-23T19:33:14.078Z",
      __v: 0,
      venter: "5e29f4f61ee1f7629c788692"
    },
    listenersWaiting: 0,
    ventersWaiting: 0,
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
      listenersWaiting,
      ventersWaiting,
      listener,
      saving,
      venter
    } = this.state;
    const { user } = this.context;

    return (
      <Consumer>
        {context => (
          <Page
            className="bg-grey align-center"
            description="Vent with strangers :)"
            keywords="vent, strangers, help"
            title="Vent or Help Now"
          >
            <Container
              className={
                "column flex-fill " + (isMobileOrTablet() ? "" : "py32")
              }
            >
              {!isMobileOrTablet() && (
                <Text
                  className="pb16"
                  text={
                    conversation
                      ? conversation.listener === user._id
                        ? "Helping"
                        : "Venting"
                      : "Chat"
                  }
                  type="h4"
                />
              )}
              {context.user && !conversation && (
                <Container className="x-wrap full-center mt16">
                  <Container
                    className="button-6 column bg-white container small mx16 mb16 br4"
                    onClick={() => {
                      this.handleChange({ conversation: true });
                      findConversation(context.socket, "listener");
                    }}
                  >
                    <Container className="column x-fill flex-fill full-center border-bottom py64">
                      <FontAwesomeIcon
                        className="blue mb8"
                        icon={faHandsHelping}
                        size="2x"
                      />
                      <Text
                        className="grey-11 fw-300 tac"
                        text="Help a Stranger"
                        type="h3"
                      />
                    </Container>
                    <Container className="column x-fill full-center py16">
                      <Text
                        className="grey-3 fw-300 tac"
                        text="Listeners Waiting"
                        type="h5"
                      />
                      <Text
                        className="grey-5 tac"
                        text={listenersWaiting + " People"}
                        type="p"
                      />
                    </Container>
                  </Container>
                  <Container
                    className="button-6 column bg-white container small mx16 mb16 br4"
                    onClick={() => {
                      this.handleChange({ conversation: true });
                      findConversation(context.socket, "venter");
                    }}
                  >
                    <Container className="column x-fill flex-fill full-center border-bottom py64">
                      <FontAwesomeIcon
                        className="blue mb8"
                        icon={faWalkieTalkie}
                        size="2x"
                      />
                      <Text
                        className="grey-11 fw-300 tac"
                        text="Vent to a Stranger"
                        type="h3"
                      />
                    </Container>
                    <Container className="column x-fill full-center py16">
                      <Text
                        className="grey-3 fw-300 tac"
                        text="Venters Waiting"
                        type="h5"
                      />
                      <Text
                        className="grey-5 tac"
                        text={ventersWaiting + " People"}
                        type="p"
                      />
                    </Container>
                  </Container>
                </Container>
              )}
              {conversation && (
                <Chat chatPartner={chatPartner} conversation={conversation} />
              )}
            </Container>
          </Page>
        )}
      </Consumer>
    );
  }
}
ChatPage.contextType = ExtraContext;

export default ChatPage;
