import React, { Component, createContext } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import firebase from "firebase/app";
import { initializeUser } from "./util";

const ExtraContext = createContext();
const { Provider, Consumer } = ExtraContext;

class GIProvider extends Component {
  state = {
    canLoadMorePosts: true,
    comments: undefined,
    hotTags: [],
    notification: {
      on: false,
      message: "",
      type: "danger",
    },
    notifications: [],
    saving: false,
    user: undefined,
    vents: undefined,
  };
  componentDidMount() {
    this._ismounted = true;
    initializeUser(this.handleChange);
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  getVents = (pathname, search) => {
    const { skip, socket } = this.state;
    let tagTemp = "";
    let tags = [];

    if (search && search.slice(0, 5) === "tags=") {
      const tagString = search.slice(5, search.length);
      for (let index in tagString) {
        if (tagString[index] == "+") {
          tags.push(tagTemp);
          tagTemp = "";
        } else tagTemp += tagString[index];
      }
      if (tagTemp) tags.push(tagTemp);
    }

    socket.emit(
      "get_problems",
      {
        page: pathname.slice(1, pathname.length),
        skip,
        tags,
      },
      (returnObj) => {
        const { problems, success } = returnObj;
        let newVents = problems;
        let canLoadMorePosts = true;

        if (newVents && newVents.length < 10) canLoadMorePosts = false;
        if (skip && this.state.vents)
          newVents = this.state.vents.concat(newVents);

        if (success)
          this.handleChange({
            canLoadMorePosts,
            vents: newVents,
          });
        else {
          // TODO: handle error
        }
      }
    );
  };

  handleChange = (stateObject, callback) => {
    if (this._ismounted) this.setState(stateObject, callback);
  };

  notify = (newNotification) => {
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

  removeVent = (ventIndex) => {
    let newCopy = [...this.state.vents];

    newCopy.splice(ventIndex, 1);

    this.handleChange({ vents: newCopy });
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
    const {
      comments,
      hotTags,
      notification,
      notifications,
      saving,
      socket,
      user,
      vents,
    } = this.state;

    return (
      <Provider
        value={{
          addComment: this.addComment,
          comments,
          getVents: this.getVents,
          handleChange: this.handleChange,
          hotTags,
          notify: this.notify,
          notifications,
          removeVent: this.removeVent,
          saving,
          soundNotify: this.soundNotify,
          updateVent: this.updateVent,
          user,
          vents,
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { GIProvider, ExtraContext };

export default withRouter(Consumer);
