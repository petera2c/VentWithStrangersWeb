import React, { Component, createContext } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import firebase from "firebase/app";
import { initializeUser } from "./util";

const UserContext = createContext();
const ExtraContext = createContext();
const { Provider, Consumer } = ExtraContext;

class GIProvider extends Component {
  state = {
    canLoadMore: true,
    comments: undefined,
    notification: {
      on: false,
      message: "",
      type: "danger"
    },
    saving: false,
    user: undefined,
    vents: undefined
  };
  componentDidMount() {
    this._ismounted = true;
    initializeUser(this.handleChange);
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  handleChange = (stateObject, callback) => {
    if (this._ismounted) this.setState(stateObject, callback);
  };

  notify = newNotification => {
    newNotification.on = true;
    this.setState({ notification: newNotification });
    alert(newNotification.message);

    if (newNotification.on) {
      setTimeout(() => {
        let { notification } = this.state;
        notification.on = false;
        this.setState({ notification });
      }, 5000);
    }
  };

  soundNotify = (sound = "bing") => {
    let folderPath = "";
    if (process.env.NODE_ENV === "development") folderPath = "static/";

    var mp3Source =
      '<source src="' + folderPath + sound + '.mp3" type="audio/mpeg">';
    var oggSource =
      '<source src="' + folderPath + sound + '.ogg" type="audio/ogg">';
    var embedSource =
      '<embed hidden="true" autostart="true" loop="false" src="' +
      folderPath +
      sound +
      '.mp3">';
    document.getElementById("sound").innerHTML =
      '<audio autoplay="autoplay">' +
      mp3Source +
      oggSource +
      embedSource +
      "</audio>";
  };

  render() {
    const { comments, notification, saving, socket, user, vents } = this.state;

    return (
      <Provider
        value={{
          addComment: this.addComment,
          comments,
          handleChange: this.handleChange,
          notify: this.notify,
          saving,
          soundNotify: this.soundNotify,
          user,
          vents
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { GIProvider, ExtraContext, UserContext };

export default withRouter(Consumer);
