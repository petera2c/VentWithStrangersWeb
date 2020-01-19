import React, { Component } from "react";
import moment from "moment-timezone";
import axios from "axios";

import Consumer, { ExtraContext } from "../../context";

import Container from "../containers/Container";
import Text from "../views/Text";
import SmallLoader from "../notifications/SmallLoader";

import "./style.css";

class Chat extends Component {
  state = {
    message: "",
    messages: []
  };
  componentDidMount() {
    this._ismounted = true;
    this.newMessageInit();
  }
  componentWillUnmount() {
    this._ismounted = false;
    const { socket } = this.context;
    socket.emit("user_left_chat");
  }
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };

  newMessageInit = () => {
    const { socket } = this.context;
    const { messages } = this.state;

    socket.on("receive_message", message => {
      messages.push(message);
      this.handleChange({ messages });

      this.scrollToBottom();
    });
  };

  sendMessage = () => {
    const { message, messages } = this.state;
    const { socket, user } = this.context;
    const { conversation } = this.props;

    if (!message) return;

    socket.emit("send_message", { message, conversationID: conversation._id });

    messages.push({
      authorID: user._id,
      body: message
    });

    this.setState({ messages, message: "" });
    this.scrollToBottom();
  };
  scrollToBottom = () => {
    if (this.messagesEnd) this.messagesEnd.scrollIntoView();
  };

  render() {
    const { message, messages } = this.state;
    const { chatPartner, conversation } = this.props;
    const { user } = this.context;

    let messageDivs = [];
    for (let index in messages) {
      let direction = "left";
      let message = messages[index];
      if (message.authorID.toString() === user._id.toString())
        direction = "right";
      //					<div className="message-time">{new moment(message.createdAt).format("HH:mm")}</div>

      messageDivs.push(
        <div
          className={"message-container " + direction}
          key={index + "message"}
        >
          <div className="message-body">{message.body}</div>
        </div>
      );
    }

    return (
      <Consumer>
        {context => (
          <div className="chat-container">
            {conversation.venter && conversation.listener && (
              <div className="messages-container">
                {messageDivs}
                <div
                  style={{ float: "left", clear: "both" }}
                  ref={el => {
                    this.messagesEnd = el;
                  }}
                />
              </div>
            )}
            {(!conversation.venter || !conversation.listener) && (
              <Container className="column full-center">
                <SmallLoader />
                <Text
                  className="tac"
                  text={`Looking for ${
                    conversation.listener
                      ? "someone who needs help"
                      : "someone to help you "
                  }. Estimated wait time 5 minutes.`}
                  type="h4"
                />
              </Container>
            )}
            {chatPartner && (
              <Container>You are chatting with {chatPartner}</Container>
            )}
            {conversation.venter && conversation.listener && (
              <div className="send-message-container">
                <textarea
                  className="send-message-textarea"
                  onChange={event =>
                    this.handleChange({ message: event.target.value })
                  }
                  value={message}
                />
                <button className="send-message" onClick={this.sendMessage}>
                  Send
                </button>
              </div>
            )}
          </div>
        )}
      </Consumer>
    );
  }
}

Chat.contextType = ExtraContext;

export default Chat;
