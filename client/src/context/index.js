import React, { Component, createContext } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

const ExtraContext = createContext();
const { Provider, Consumer } = ExtraContext;

class GIProvider extends Component {
  state = {
    hotTags: [],
    notification: {
      on: false,
      title: "Something went wrong!",
      message: "",
      type: "danger"
    },
    problems: [],
    saving: false,
    socket: undefined,
    user: undefined
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

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
  handleChange = stateObject => {
    if (this._ismounted) this.setState(stateObject);
  };

  getProblems = (pathname, search) => {
    let tagTemp = "";
    let tags = [];

    for (let index in search) {
      if (search[index] == "?") continue;
      else if (search[index] == "+") {
        tags.push(tagTemp);
        tagTemp = "";
      } else tagTemp += search[index];
    }
    if (tagTemp) tags.push(tagTemp);

    axios.post("/api/problems" + pathname, { tags }).then(res => {
      const { success, problems } = res.data;
      if (success) this.handleChange({ problems });
      else {
        // TODO: handle error
      }
    });
  };
  render() {
    const {
      hotTags,
      notification,
      problems,
      saving,
      socket,
      user
    } = this.state;

    return (
      <Provider
        value={{
          getProblems: this.getProblems,
          handleChange: this.handleChange,
          hotTags,
          notify: this.notify,
          problems,
          saving,
          socket,
          user
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { GIProvider, ExtraContext };

export default withRouter(Consumer);
