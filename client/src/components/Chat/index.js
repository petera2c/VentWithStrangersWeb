import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

import Consumer, { ExtraContext } from "../../context";

import SmallLoader from "../notifications/SmallLoader";

import "./style.css";

class Chat extends Component {
  state = {
    message: "",
    messages: []
  };
  componentDidMount() {
    this.newMessageInit();
  }

  newMessageInit = () => {
    const { socket } = this.context;
    const { messages } = this.state;

    socket.on("receive_message", message => {
      messages.push(message);
      this.setState({ messages });

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
      author: user._id,
      body: message
    });

    this.setState({ messages, message: "" });
    this.scrollToBottom();
  };
  handleChange = (value, index) => {
    if (value[value.length - 1] === "\n") {
      return this.sendMessage();
    }
    this.setState({ [index]: value });
  };
  scrollToBottom = () => {
    if (this.messagesEnd) this.messagesEnd.scrollIntoView();
  };

  render() {
    const { message, messages } = this.state;
    const { conversation } = this.props;
    const { user } = this.context;

    let messageDivs = [];
    for (let index in messages) {
      let direction = "left";
      let message = messages[index];

      if (message.author.toString() === user._id.toString())
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
              <SmallLoader />
            )}
            {conversation.venter && conversation.listener && (
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
        )}
      </Consumer>
    );
  }
}

Chat.contextType = ExtraContext;

export default Chat;
