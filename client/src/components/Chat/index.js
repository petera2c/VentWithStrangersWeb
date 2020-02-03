import React, { Component } from "react";
import moment from "moment-timezone";
import axios from "axios";

import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";

import LoadingHeart from "../loaders/Heart";

import ConfirmAlertModal from "../modals/ConfirmAlert";
import Container from "../containers/Container";

import Button from "../views/Button";
import Text from "../views/Text";

import { capitolizeFirstChar, isMobileOrTablet } from "../../util";

import "./style.css";

class Chat extends Component {
  state = {
    leaveConfirm: false,
    message: "",
    messages: [],
    metaTitle: "",
    userLeft: false
  };
  componentDidMount() {
    this._ismounted = true;
    this.chatInit();

    window.addEventListener("keypress", this.submitByEnterKey);
  }
  componentWillUnmount() {
    this._ismounted = false;
    const { socket } = this.context;

    socket.emit("leave_chat");

    window.removeEventListener("keypress", this.submitByEnterKey);
  }

  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };

  chatInit = () => {
    const { startMetaChangeInterval } = this.props; // Functions
    const { socket } = this.context;
    const { messages } = this.state;

    socket.on("receive_message", message => {
      const { chatPartner } = this.props;

      messages.push(message);
      this.handleChange({ messages });

      this.scrollToBottom();

      if (!document.hasFocus() && chatPartner) {
        startMetaChangeInterval(chatPartner + "'s Waiting", "New Message");
      }
    });

    socket.on("user_left", () => {
      this.handleChange({ userLeft: true });
    });
  };

  scrollToBottom = () => {
    if (this.messagesEnd) this.messagesEnd.scrollIntoView();
  };
  sendMessage = () => {
    const { message, messages, userLeft } = this.state;
    const { socket, user } = this.context;
    const { conversation } = this.props;

    if (!message || !conversation.venter || !conversation.listener || userLeft)
      return;

    socket.emit("send_message", { message, conversationID: conversation._id });

    messages.push({
      authorID: user._id,
      body: message
    });

    this.setState({ messages, message: "" });
    this.scrollToBottom();
  };

  submitByEnterKey = e => {
    if (e && e.keyCode && e.keyCode === 13) {
      // user pressed enter key
      this.sendMessage();
    }
  };

  render() {
    const { leaveConfirm, message, messages, userLeft } = this.state;
    const { leaveChat } = this.props;
    const { chatPartner, conversation } = this.props; // Variables
    const { user } = this.context;

    let messageDivs = [];
    for (let index in messages) {
      const message = messages[index];
      if (message.authorID.toString() === user._id.toString())
        messageDivs.push(
          <Container className="x-fill justify-end" key={index}>
            <Container className="message-container bg-blue white px16 py8 mb8 br4">
              {message.body}
            </Container>
          </Container>
        );
      else
        messageDivs.push(
          <Container className="x-fill wrap" key={index}>
            <Container className="message-container grey-1 bg-grey-10 px16 py8 mb8 br4">
              {message.body}
            </Container>
          </Container>
        );
    }
    return (
      <Consumer>
        {context => (
          <Container
            className={
              "column full-center flex-fill ov-auto bg-white br4 " +
              (isMobileOrTablet()
                ? "container mobile-full"
                : "container large shadow-3")
            }
          >
            <Container className="x-fill justify-between border-bottom pa16">
              {!chatPartner && (
                <Text
                  className="fw-400"
                  text="Waiting Connection..."
                  type="h5"
                />
              )}
              {chatPartner && !userLeft && (
                <Text
                  className="fw-400"
                  text={`You are chatting with ${capitolizeFirstChar(
                    chatPartner
                  )}`}
                  type="h5"
                />
              )}
              {chatPartner && userLeft && (
                <Text
                  className="fw-400"
                  text={` ${capitolizeFirstChar(chatPartner)} has left chat.`}
                  type="h5"
                />
              )}
              <Container
                className="clickable round-icon bg-red"
                onClick={() => this.handleChange({ leaveConfirm: true })}
              >
                <FontAwesomeIcon className="white" icon={faTimes} />
              </Container>
            </Container>

            {conversation.venter && conversation.listener && (
              <Container className="column x-fill flex-fill ov-auto pa16">
                {messageDivs}
                <div
                  style={{ float: "left", clear: "both" }}
                  ref={el => {
                    this.messagesEnd = el;
                  }}
                />
              </Container>
            )}
            {(!conversation.venter || !conversation.listener) && (
              <Container className="column x-fill flex-fill full-center ov-auto pa16">
                <LoadingHeart />
                <Text
                  className="fw-400 tac blue"
                  text={`Looking for ${
                    conversation.listener
                      ? "someone who needs help"
                      : "someone to help you "
                  }.`}
                  type="h4"
                />
                <Text
                  className="fw-400 tac"
                  text="Estimated wait time 5 minutes."
                  type="h5"
                />
              </Container>
            )}

            <Container className="column x-fill">
              {userLeft && (
                <Text
                  className="x-fill tac"
                  text={`${chatPartner} has left chat.`}
                  type="h5"
                />
              )}
              <Container
                className={
                  "x-fill border-top  " +
                  (isMobileOrTablet() ? "" : "align-center pr16")
                }
                style={{
                  minHeight: isMobileOrTablet() ? "" : "80px"
                }}
              >
                <textarea
                  className={
                    "send-message-textarea light-scrollbar " +
                    (isMobileOrTablet() ? "" : "pa16")
                  }
                  onChange={event =>
                    this.handleChange({ message: event.target.value })
                  }
                  placeholder="Type a helpful message here..."
                  value={message}
                />
                <Button
                  className={
                    "button-2 " +
                    (isMobileOrTablet() ? "px8 py4" : "px32 py8 br4")
                  }
                  onClick={this.sendMessage}
                  text="Send"
                />
              </Container>
            </Container>
            {leaveConfirm && (
              <ConfirmAlertModal
                close={() => this.handleChange({ leaveConfirm: false })}
                message="Are you sure you would like to leave chat?"
                submit={leaveChat}
                title="Leave Chat"
              />
            )}
          </Container>
        )}
      </Consumer>
    );
  }
}

Chat.contextType = ExtraContext;

export default Chat;
