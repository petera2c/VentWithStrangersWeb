import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import axios from "axios";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

import GIText from "../../components/views/GIText";
import GIButton from "../../components/views/GIButton";
import GIInput from "../../components/views/GIInput";
import Consumer from "../../context";

class LoginPage extends Component {
  state = {
    email: "",
    password: ""
  };
  componentDidMount() {
    const { history } = this.props;
    const { user } = this.context; // Variables
    const { notify } = this.context; // Functions

    if (user) {
      history.push("/home");
      notify({
        message: "You are already logged in!",
        type: "danger",
        title: "Hello there"
      });
    }
  }

  handleChange = (index, value) => {
    this.setState({ [index]: value });
  };

  login = (context, event) => {
    event.preventDefault();
    const { email, password } = this.state;

    if (email && password) {
      axios
        .post("/api/login", { email: email.toLowerCase(), password })
        .then(res => {
          const { message, success, user } = res.data;

          if (success) {
            context.handleChange({ user });
          } else {
            context.notify({
              message,
              type: "danger",
              title: "Something went wrong!"
            });
          }
        });
    }
  };

  render() {
    const { email, password } = this.state;

    return (
      <Consumer>
        {context => (
          <Page
            title="Sign In"
            description="Sign in"
            keywords=""
            className="column align-center py32 mt64"
          >
            <GIContainer className="column x-50 bg-white pa64 br16">
              <GIInput
                className="py8 px16 mb8 br4"
                value={email}
                onChange={event =>
                  this.handleChange("email", event.target.value)
                }
                type="text"
                name="email"
                placeholder="Email"
                required
              />
              <GIInput
                className="py8 px16 mb8 br4"
                value={password}
                onChange={e => this.handleChange("password", e.target.value)}
                name="password"
                type="password"
                placeholder="Password"
                required
              />
              <GIButton
                className="bg-blue white py8 mb8 br4"
                onClick={e => this.login(context, e)}
                text="Sign In"
              />
            </GIContainer>
            <Link className="white mt16" to="/sign-up">
              Sign Up Now
            </Link>
          </Page>
        )}
      </Consumer>
    );
  }
}

export default withRouter(LoginPage);
