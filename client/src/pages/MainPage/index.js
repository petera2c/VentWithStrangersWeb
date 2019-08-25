import React, { Component } from "react";
import axios from "axios";

import Chat from "../../Components/Chat/";
import Loader from "../../Components/Loader/";

import "./style.css";

class MainPage extends Component {
  state = {
    saving: true,
    listener: false,
    venter: false,
    user: this.props.user
  };

  becomeListener = () => {
    this.setState({ saving: true, listener: true, venter: false });
    axios.post("/api/conversation/", {}).then(res => {
      const { success } = res.data;
      this.setState({ saving: false });
    });
  };
  becomeVenter = () => {
    this.setState({ saving: true, listener: false, venter: true });
    axios.post("/api/conversation", {}).then(res => {
      const { success } = res.data;
      this.setState({ saving: false });
    });
  };

  render() {
    const { saving, venter, listener, user, port } = this.state;

    return (
      <div className="master-container">
        {user && !venter && !listener && (
          <div className="center-container">
            <div className="option-container" onClick={this.becomeListener}>
              Help a Stranger
            </div>
            <div className="option-container" onClick={this.becomeVenter}>
              Vent to a Stranger
            </div>
          </div>
        )}
        {(venter || listener) && (
          <div className="center-container">
            {listener && (
              <div className="side-small-box" onClick={this.becomeVenter}>
                Vent to a Stranger
              </div>
            )}
            {venter && (
              <div className="side-small-box" onClick={this.becomeListener}>
                Help a Stranger
              </div>
            )}
            <Chat user={user} listener={listener} port={port} />
          </div>
        )}
        {saving && <Loader />}
      </div>
    );
  }
}

export default MainPage;
