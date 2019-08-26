import React, { Component } from "react";
import axios from "axios";

import Chat from "../../Components/Chat/";
import Loader from "../../Components/Loader/";

import { extraContext } from "../../context";

import { initSocket } from "./util";

import "./style.css";

class MainPage extends Component {
  state = {
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
  something = (socket, type) => {
    socket.emit("find_conversation", { type });
  };

  render() {
    const { listener, saving, socket, user, venter } = this.state;

    return (
      <div className="master-container">
        {user && !venter && !listener && (
          <div className="center-container">
            <div
              className="option-container"
              onClick={() => this.something(socket, "listener")}
            >
              Help a Stranger
            </div>
            <div
              className="option-container"
              onClick={() => this.something(socket, "venter")}
            >
              Vent to a Stranger
            </div>
          </div>
        )}
        {(venter || listener) && (
          <div className="center-container">
            <Chat user={user} listener={listener} />
          </div>
        )}
        {saving && <Loader />}
      </div>
    );
  }
}

MainPage.contextType = extraContext;

export default MainPage;
