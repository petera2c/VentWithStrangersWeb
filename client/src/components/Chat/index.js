import React, { Component } from "react";
import moment from "moment";
import io from "socket.io-client";
import axios from "axios";

import SmallLoader from "../SmallLoader";

import "./style.css";

const socketUrl = "http://localhost:5000";
class Chat extends Component {
  state = {
    message: "",
    conversation: undefined,
    messages: [],
    socket: undefined
  };
  componentDidUpdate() {
    if (this.state.conversation) this.scrollToBottom();
  }
  componentDidMount() {
    this.initSocket();
  }
  initSocket = () => {
    const { user, listener, port } = this.props;

    let socket;
    if (port) socket = io();
    else socket = io(socketUrl);

    let type = "listener";

    if (!listener) {
      type = "venter";
    }
    socket.emit("find_conversation", { user, type });

    socket.on("found_conversation", conversation => {
      this.setState({ conversation });
    });

    socket.on("receive_message", message => {
      let { messages } = this.state;
      messages.push(message);
      this.setState({ messages });

      this.scrollToBottom();
    });
    this.setState({ socket });
  };
  sendMessage = () => {
    const { socket, message, conversation, messages } = this.state;
    const { user } = this.props;

    if (!message) return;

    socket.emit("send_message", { user, message, conversation });
    messages.push({
      body: message,
      author: user._id,
      conversationID: conversation._id
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
    const { message, conversation, messages } = this.state;
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
