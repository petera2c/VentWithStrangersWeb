import React, { Component } from "react";
import axios from "axios";

import Chat from "../../Components/Chat/";
import Loader from "../../Components/Loader/";

import { extraContext } from "../../context";

import { findConversation, initSocket } from "./util";

import "./style.css";

class MainPage extends Component {
  state = {
    conversation: undefined,
    listener: false,
    saving: true,
    socket: undefined,
    user: undefined,
    venter: false
  };
  componentDidMount() {
    axios.get("/api/user").then(res => {
      const { success, user, message, port } = res.data;

      if (success) {
        this.setState({ saving: false, user });
        initSocket(this.handleChange, port);
      } else {
        alert(message);
      }
    });
  }
  handleChange = stateObj => {
    this.setState(stateObj);
  };
  render() {
    const { conversation, listener, saving, socket, user, venter } = this.state;

    return (
      <div className="master-container">
        {user && !conversation && (
          <div className="center-container">
            <div
              className="option-container"
              onClick={() => {
                this.handleChange({ conversation: true });
                findConversation(socket, "listener");
              }}
            >
              Help a Stranger
            </div>
            <div
              className="option-container"
              onClick={() => {
                this.handleChange({ conversation: true });
                findConversation(socket, "venter");
              }}
            >
              Vent to a Stranger
            </div>
          </div>
        )}
        {conversation && (
          <div className="center-container">
            <Chat conversation={conversation} socket={socket} user={user} />
          </div>
        )}
        {saving && <Loader />}
      </div>
    );
  }
}

MainPage.contextType = extraContext;

export default MainPage;
