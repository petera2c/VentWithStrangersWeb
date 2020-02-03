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
import { findConversation } from "./util";

const INITIAL_META_TITLE = "Chat";
var myVar;

class ChatPage extends Component {
  state = {
    chatPartner: undefined,
    conversation: false,
    listener: false,
    listenersWaiting: 0,
    metaTitle: INITIAL_META_TITLE,
    saving: true,
    venter: false,
    ventersWaiting: 0
  };
  componentDidMount() {
    this._ismounted = true;
    window.addEventListener("focus", this.onFocus);

    const { socket } = this.context;

    if (socket) {
      socket.emit("get_users_waiting", stateObj => {
        this.handleChange(stateObj);
      });
      this.initUserJoined(this.handleChange, socket);
      socket.on("users_waiting", stateObj => {
        this.handleChange(stateObj);
      });
    }
  }
  componentWillUnmount() {
    this._ismounted = false;
    window.removeEventListener("focus", this.onFocus);
  }

  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };

  initUserJoined = (callback, socket) => {
    socket.on("user_joined_chat", stateObj => {
      callback(stateObj);

      if (!document.hasFocus() && stateObj.chatPartner) {
        this.startMetaChangeInterval(
          stateObj.chatPartner + " Joined",
          "Start Chatting"
        );
      }
    });
  };
  onFocus = () => {
    if (document.hasFocus()) {
      this.handleChange({ metaTitle: INITIAL_META_TITLE });
    }
  };
  startMetaChangeInterval = (metaTitle1, metaTitle2) => {
    this.handleChange({ metaTitle: metaTitle1 });
    clearInterval(myVar);

    myVar = setInterval(() => {
      if (document.hasFocus()) {
        this.handleChange({ metaTitle: INITIAL_META_TITLE });
        clearInterval(myVar);
      } else {
        if (this.state.metaTitle === metaTitle1)
          this.handleChange({ metaTitle: metaTitle2 });
        else this.handleChange({ metaTitle: metaTitle1 });
      }
    }, 1200);
  };

  render() {
    const {
      chatPartner,
      conversation,
      listener,
      listenersWaiting,
      metaTitle,
      saving,
      venter,
      ventersWaiting
    } = this.state;
    const { user } = this.context;

    return (
      <Consumer>
        {context => (
          <Page
            className="bg-grey-2 ov-auto"
            description="Sometimes, all we need is an available ear. This is where you can anonymously talk to someone that wants to listen, or anonymously listen to someone that wants to be heard."
            keywords="vent, strangers, help"
            title={metaTitle}
          >
            <Container
              className={
                "column flex-fill ov-auto align-center " +
                (isMobileOrTablet() ? "" : "py32")
              }
            >
              {context.user && !conversation && (
                <Container className="column">
                  {!isMobileOrTablet() && (
                    <Text className="pt32" text="Chat" type="h4" />
                  )}
                  <Container
                    className={
                      "wrap full-center " +
                      (isMobileOrTablet() ? "mt32" : "mt16")
                    }
                  >
                    <Container
                      className={
                        "button-6 column bg-white shadow-3 container small mb16 br8 " +
                        (isMobileOrTablet() ? "px16" : "mr32")
                      }
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
                      className={
                        "button-6 column bg-white shadow-3 container small mb16 br8 " +
                        (isMobileOrTablet() ? "px16" : "")
                      }
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
                </Container>
              )}
              {conversation && (
                <Container
                  className={
                    "column flex-fill ov-auto " +
                    (isMobileOrTablet() ? "" : "px16 pb16")
                  }
                >
                  {!isMobileOrTablet() && (
                    <Text
                      className="pb16"
                      text={
                        conversation.listener === user._id
                          ? "Helping"
                          : "Venting"
                      }
                      type="h4"
                    />
                  )}
                  <Chat
                    chatPartner={chatPartner}
                    conversation={conversation}
                    leaveChat={() =>
                      this.handleChange({
                        chatPartner: undefined,
                        conversation: false
                      })
                    }
                    startMetaChangeInterval={this.startMetaChangeInterval}
                  />
                </Container>
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
