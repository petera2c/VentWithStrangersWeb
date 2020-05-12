import React, { Component, createContext } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

const ExtraContext = createContext();
const { Provider, Consumer } = ExtraContext;

class GIProvider extends Component {
  state = {
    canLoadMorePosts: true,
    comments: undefined,
    hotTags: [],
    skip: 0,
    notification: {
      on: false,
      message: "",
      type: "danger"
    },
    notifications: [],
    saving: false,
    socket: undefined,
    user: undefined,
    vents: undefined
  };
  componentDidMount() {
    this._ismounted = true;
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
        tags
      },
      returnObj => {
        const { problems, success } = returnObj;
        let newVents = problems;
        let canLoadMorePosts = true;

        if (newVents && newVents.length < 10) canLoadMorePosts = false;
        if (skip && this.state.vents)
          newVents = this.state.vents.concat(newVents);

        if (success)
          this.handleChange({
            canLoadMorePosts,
            vents: newVents
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

  removeVent = ventIndex => {
    let { vents } = this.state;

    vents.splice(ventIndex, 1);

    this.handleChange({ vents });
  };

  render() {
    const {
      canLoadMorePosts,
      comments,
      hotTags,
      skip,
      notification,
      notifications,
      saving,
      socket,
      user,
      vents
    } = this.state;

    return (
      <Provider
        value={{
          addComment: this.addComment,
          canLoadMorePosts,
          comments,
          getVents: this.getVents,
          handleChange: this.handleChange,
          hotTags,
          skip,
          notify: this.notify,
          notifications,
          removeVent: this.removeVent,
          saving,
          socket,
          updateVent: this.updateVent,
          user,
          vents
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { GIProvider, ExtraContext };

export default withRouter(Consumer);
