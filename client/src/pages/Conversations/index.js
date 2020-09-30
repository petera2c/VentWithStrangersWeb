import React, { Component } from "react";
import axios from "axios";

import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
var myVar2;

class ChatPage extends Component {
  state = {
    chatPartner: undefined,
    conversation: false,
    listenersWaiting: 0,
    metaTitle: INITIAL_META_TITLE,
    userLeft: false,
    ventersWaiting: 0,
  };
  componentDidMount() {
    this._ismounted = true;
    window.addEventListener("focus", this.onFocus);
    window.addEventListener("blur", this.onFocus);
    const { socket, soundNotify } = this.context;

    if (socket) {
      socket.emit("get_users_waiting", (stateObj) => {
        this.handleChange(stateObj, this.onFocus);
      });
      this.initUserJoined(this.handleChange, socket, soundNotify);
      socket.on("users_waiting", (stateObj) => {
        const { conversation, listenersWaiting, ventersWaiting } = this.state;
        if (
          !conversation &&
          (stateObj.listenersWaiting > listenersWaiting ||
            stateObj.ventersWaiting > ventersWaiting)
        ) {
          soundNotify();
          if (Notification.permission !== "granted")
            Notification.requestPermission();
          else {
            var notification = new Notification("New user waiting to chat!", {
              icon: "https://www.ventwithstrangers.com/favicon.ico",
            });
          }
        }
        this.handleChange(stateObj, this.onFocus);
      });
      socket.on("user_left", () => {
        this.handleChange({ userLeft: true });
      });
    }
  }

  componentWillUnmount() {
    this._ismounted = false;

    const { socket } = this.context;

    if (socket) {
      socket.off("get_users_waiting");
      socket.off("users_waiting");
      socket.off("user_left");
    }

    window.removeEventListener("focus", this.onFocus);
    window.removeEventListener("blue", this.onFocus);
  }

  handleChange = (stateObj, callback) => {
    if (this._ismounted) this.setState(stateObj, callback);
  };

  initUserJoined = (callback, socket, soundNotify) => {
    socket.on("user_joined_chat", (stateObj) => {
      callback(stateObj);

      if (!document.hasFocus() && stateObj.chatPartner) {
        soundNotify();
        if (Notification.permission !== "granted")
          Notification.requestPermission();
        else {
          var notification = new Notification("User joined chat!", {
            icon: "https://www.ventwithstrangers.com/favicon.ico",
          });
        }
        this.startMetaChangeInterval(
          stateObj.chatPartner + " Joined",
          "Start Chatting"
        );
      }
    });
  };

  onFocus = () => {
    const { conversation, listenersWaiting, ventersWaiting } = this.props;
    if (document.hasFocus()) {
      this.handleChange({ metaTitle: INITIAL_META_TITLE });
    } else if (!document.hasFocus() && !conversation)
      this.startMetaChangeIntervalWaiters();
  };
  startMetaChangeInterval = (metaTitle1, metaTitle2) => {
    this.handleChange({ metaTitle: metaTitle1 });
    clearInterval(myVar);

    myVar = setInterval(() => {
      const { userLeft } = this.state;

      if (userLeft) {
        clearInterval(myVar);
        this.handleChange({ metaTitle: "User left chat" });
      } else if (document.hasFocus()) {
        clearInterval(myVar);
        this.handleChange({ metaTitle: INITIAL_META_TITLE });
      } else {
        if (this.state.metaTitle === metaTitle1)
          this.handleChange({ metaTitle: metaTitle2 });
        else this.handleChange({ metaTitle: metaTitle1 });
      }
    }, 1200);
  };

  startMetaChangeIntervalWaiters = () => {
    clearInterval(myVar2);

    myVar2 = setInterval(() => {
      const { conversation, listenersWaiting, ventersWaiting } = this.state;
      let metaTitle1 = "";
      let metaTitle2 = "";

      if (listenersWaiting) {
        metaTitle1 = listenersWaiting + " Listener Waiting";
        metaTitle2 = "Vent Now";
      } else {
        metaTitle1 = ventersWaiting + " Venter Waiting";
        metaTitle2 = "Help Now";
      }

      if (
        document.hasFocus() ||
        conversation ||
        (!listenersWaiting && !ventersWaiting)
      ) {
        clearInterval(myVar2);
        this.handleChange({ metaTitle: INITIAL_META_TITLE });
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
      listenersWaiting,
      metaTitle,
      userLeft,
      ventersWaiting,
    } = this.state;
    const { user } = this.context;

    return (
      <Consumer>
        {(context) => (
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
              {!conversation && (
                <Container className="x-fill justify-center align-start">
                  <Text
                    className={
                      "fw-400 fs-20 " +
                      (isMobileOrTablet()
                        ? "container mobile-full pa16"
                        : "container extra-large pr32 pb32")
                    }
                    text="People care and help is here. Vent and chat anonymously to be a part of a community committed to making the world a better place. This is a website for people that want to be heard and people that want to listen."
                    type="h2"
                  />
                </Container>
              )}
              {context.user && !conversation && (
                <Container className="column">
                  <Text
                    className={
                      "primary fs-20 " + (isMobileOrTablet() ? "px32 pt32" : "")
                    }
                    text="Vent with a Stranger"
                    type="h1"
                  />
                  <Container className="wrap full-center mt16">
                    <Container
                      className={
                        "button-6 column bg-white border-all2 container small mb16 br8 " +
                        (isMobileOrTablet() ? "px16" : "mr32")
                      }
                      onClick={() => {
                        this.handleChange({
                          conversation: true,
                          userLeft: false,
                        });
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
                        "button-6 column bg-white border-all2 container small mb16 br8 " +
                        (isMobileOrTablet() ? "px16" : "")
                      }
                      onClick={() => {
                        this.handleChange({
                          conversation: true,
                          userLeft: false,
                        });
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
                        conversation: false,
                      })
                    }
                    startMetaChangeInterval={this.startMetaChangeInterval}
                    userLeft={userLeft}
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
