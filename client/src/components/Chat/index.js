import React, { Component } from "react";
import moment from "moment-timezone";
import axios from "axios";

import Consumer, { ExtraContext } from "../../context";

import LoadingHeart from "../loaders/Heart";

import Container from "../containers/Container";

import Button from "../views/Button";
import Text from "../views/Text";

import { capitolizeFirstChar, isMobileOrTablet } from "../../util";

import "./style.css";

class Chat extends Component {
  state = {
    message: "",
    messages: [
      {
        _id: "5e29f4b71ee1f7629c788683",
        conversationID: "5e29f4af1ee1f7629c78867f",
        body: "asdfdf",
        authorID: "5e29f4b11ee1f7629c788682",
        createdAt: "2020-01-23T19:32:07.929Z",
        updatedAt: "2020-01-23T19:32:07.929Z",
        __v: 0
      },
      {
        _id: "5e29f4b81ee1f7629c788684",
        conversationID: "5e29f4af1ee1f7629c78867f",
        body: "asdf",
        authorID: "5e29f4b11ee1f7629c788682",
        createdAt: "2020-01-23T19:32:08.724Z",
        updatedAt: "2020-01-23T19:32:08.724Z",
        __v: 0
      },
      {
        _id: "5e29f4b81ee1f7629c788685",
        conversationID: "5e29f4af1ee1f7629c78867f",
        body: "\ndf",
        authorID: "5e29f4b11ee1f7629c788682",
        createdAt: "2020-01-23T19:32:08.935Z",
        updatedAt: "2020-01-23T19:32:08.935Z",
        __v: 0
      },
      {
        _id: "5e29f4b91ee1f7629c788686",
        conversationID: "5e29f4af1ee1f7629c78867f",
        body: "\nfd",
        authorID: "5e29f4b11ee1f7629c788682",
        createdAt: "2020-01-23T19:32:09.136Z",
        updatedAt: "2020-01-23T19:32:09.136Z",
        __v: 0
      },
      {
        _id: "5e29f4b91ee1f7629c788687",
        conversationID: "5e29f4af1ee1f7629c78867f",
        body: "\nfasd",
        authorID: "5e29f4b11ee1f7629c788682",
        createdAt: "2020-01-23T19:32:09.342Z",
        updatedAt: "2020-01-23T19:32:09.342Z",
        __v: 0
      },
      {
        _id: "5e29f4b91ee1f7629c788688",
        conversationID: "5e29f4af1ee1f7629c78867f",
        body: "\nfasd",
        authorID: "5e29f4b11ee1f7629c788682",
        createdAt: "2020-01-23T19:32:09.629Z",
        updatedAt: "2020-01-23T19:32:09.629Z",
        __v: 0
      },
      {
        _id: "5e29f4b91ee1f7629c788689",
        conversationID: "5e29f4af1ee1f7629c78867f",
        body: "\nf",
        authorID: "5e29f4b11ee1f7629c788682",
        createdAt: "2020-01-23T19:32:09.684Z",
        updatedAt: "2020-01-23T19:32:09.684Z",
        __v: 0
      },
      {
        _id: "5e29f4b91ee1f7629c78868a",
        conversationID: "5e29f4af1ee1f7629c78867f",
        body: "\nsadf",
        authorID: "5e29f4b11ee1f7629c788682",
        createdAt: "2020-01-23T19:32:09.792Z",
        updatedAt: "2020-01-23T19:32:09.792Z",
        __v: 0
      },
      {
        _id: "5e29f4b91ee1f7629c78868b",
        conversationID: "5e29f4af1ee1f7629c78867f",
        body: "\nasd",
        authorID: "5e29f4b11ee1f7629c788682",
        createdAt: "2020-01-23T19:32:09.951Z",
        updatedAt: "2020-01-23T19:32:09.951Z",
        __v: 0
      },
      {
        _id: "5e29f4ba1ee1f7629c78868c",
        conversationID: "5e29f4af1ee1f7629c78867f",
        body: "\ndfasd",
        authorID: "5e29f4b11ee1f7629c788682",
        createdAt: "2020-01-23T19:32:10.119Z",
        updatedAt: "2020-01-23T19:32:10.119Z",
        __v: 0
      },
      {
        _id: "5e29f4ba1ee1f7629c78868d",
        conversationID: "5e29f4af1ee1f7629c78867f",
        body: "\nas",
        authorID: "5e29f4b11ee1f7629c788682",
        createdAt: "2020-01-23T19:32:10.387Z",
        updatedAt: "2020-01-23T19:32:10.387Z",
        __v: 0
      },
      {
        _id: "5e29f4bb1ee1f7629c78868e",
        conversationID: "5e29f4af1ee1f7629c78867f",
        body: "\ndf",
        authorID: "5e29f4b11ee1f7629c788682",
        createdAt: "2020-01-23T19:32:11.510Z",
        updatedAt: "2020-01-23T19:32:11.510Z",
        __v: 0
      }
    ]
  };
  componentDidMount() {
    this._ismounted = true;
    this.newMessageInit();

    window.addEventListener("keypress", this.submitByEnterKey);
  }
  componentWillUnmount() {
    this._ismounted = false;
    const { socket } = this.context;
    socket.emit("user_left_chat");
    window.removeEventListener("keypress", this.submitByEnterKey);
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

  scrollToBottom = () => {
    if (this.messagesEnd) this.messagesEnd.scrollIntoView();
  };
  sendMessage = () => {
    const { message, messages } = this.state;
    const { socket, user } = this.context;
    const { conversation } = this.props;

    if (!message || !conversation.venter || !conversation.listener) return;

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
    const { message, messages } = this.state;
    const { chatPartner, conversation } = this.props;
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
            className="column full-center flex-fill ov-auto bg-white ov-hidden br4"
            style={{
              width: isMobileOrTablet() ? "100vw" : "50vw"
            }}
          >
            {chatPartner && (
              <Container className="x-fill border-bottom pa16">
                <Text
                  className="fw-400"
                  text={`You are chatting with ${capitolizeFirstChar(
                    chatPartner
                  )}`}
                  type="h5"
                />
              </Container>
            )}
            {!chatPartner && (
              <Container className="x-fill border-bottom pa16">
                <Text
                  className="fw-400"
                  text="Waiting Connection..."
                  type="h5"
                />
              </Container>
            )}
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
        )}
      </Consumer>
    );
  }
}

Chat.contextType = ExtraContext;

export default Chat;
