import React, { Component, createContext } from "react";

const ExtraContext = createContext();
const { Provider, Consumer } = ExtraContext;

class GIProvider extends Component {
  state = {
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
  render() {
    const { notification, problems, saving, socket, user } = this.state;

    return (
      <Provider
        value={{
          handleChange: this.handleChange,
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

export default Consumer;
