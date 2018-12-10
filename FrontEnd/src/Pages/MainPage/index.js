import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser } from "../../Redux/Actions/";

import Chat from "../../Components/Chat/";
import Loader from "../../Components/Loader/";
import "./Styles/";

class MainPage extends Component {
  state = {
    saving: true,
    listener: false,
    venter: false,
    user: this.props.user
  };
  componentDidMount() {
    axios.get("/api/user").then(res => {
      let { success, user, message, port } = res.data;

      if (success) {
        this.props.setUser(user);
        this.setState({ saving: false, user, port });
      } else {
        alert(message);
      }
    });
  }
  becomeListener = () => {
    this.setState({ saving: true, listener: true, venter: false });
    axios
      .post("/api/user", {
        userChangesArray: [{ index: "type", value: "listener" }]
      })
      .then(res => {
        const { user } = res.data;
        this.props.setUser(user);
        this.setState({ user });
        this.setState({ saving: false });
      });
  };
  becomeVenter = () => {
    this.setState({ saving: true, listener: false, venter: true });
    axios
      .post("/api/user", {
        userChangesArray: [{ index: "type", value: "venter" }]
      })
      .then(res => {
        const { user } = res.data;
        this.props.setUser(user);
        this.setState({ user });
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

function mapStateToProps(state) {
  return { user: state.user };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setUser: setUser }, dispatch);
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPage);
