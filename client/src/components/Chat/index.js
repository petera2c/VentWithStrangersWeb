import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

import SmallLoader from "../SmallLoader";

import { messageInit } from "./util";

import "./style.css";

class Chat extends Component {
  state = {
    message: "",
    conversation: undefined,
    messages: [],
    socket: undefined
  };
  componentDidMount() {
    this.newMessageInit();
  }
  componentDidUpdate() {
    if (this.state.conversation) this.scrollToBottom();
  }
  newMessageInit = () => {
    const { socket } = this.props;

    socket.on("receive_message", message => {
      messages.push(message);
      this.setState({ messages });

      this.scrollToBottom();
    });
  };

  sendMessage = () => {
    const { message, messages } = this.state;
    const { socket, user } = this.props;

    if (!message) return;

    socket.emit("send_message", { user, message });
    messages.push({
      body: message
    });
    this.setState({ messages, message: "" });
    this.scrollToBottom();
  };
  handleChange = (value, index) => {
    if (value[value.length - 1] === "\n") {
      this.sendMessage();
      return;
    }
    this.setState({ [index]: value });
  };
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView();
  };

  render() {
    const { conversation, message, messages } = this.state;
    const { user } = this.props;

    let messageDivs = [];
    for (let index in messages) {
      let direction = "left";
      let message = messages[index];

      if (message.author === user._id) direction = "right";
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
      <div className="chat-container">
        {conversation && (
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
        {!conversation && <SmallLoader />}
        {conversation && (
          <div className="send-message-container">
            <textarea
              className="send-message-textarea"
              onChange={event =>
                this.handleChange(event.target.value, "message")
              }
              value={message}
            />
            <button className="send-message" onClick={this.sendMessage}>
              Send
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Chat;
