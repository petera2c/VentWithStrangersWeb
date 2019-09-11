import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import axios from "axios";

import { validateEmail } from "./util";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

import GIText from "../../components/views/GIText";
import GIButton from "../../components/views/GIButton";

import Consumer from "../../context";

let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

class RegisterPage extends Component {
  state = {
    fullName: "",
    email: "",
    userName: "",
    timezone: timezone ? timezone : "America/Vancouver",
    password: "",
    passwordConfirm: ""
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

  register = (context, event) => {
    event.preventDefault();

    const {
      fullName,
      email,
      timezone,
      password,
      passwordConfirm,
      userName
    } = this.state;

    if (!validateEmail(email)) {
      alert("Not a real email address!");
      return;
    }

    if (fullName && email && userName && timezone && password) {
      if (password !== passwordConfirm) {
        alert("Passwords do not match.");
        return;
      }
      axios
        .post("/api/register", {
          fullName,
          email: email.toLowerCase(),
          userName,
          timezone,
          password
        })
        .then(res => {
          const { success, user, message } = res.data;

          if (success && user) this.context.handleChange({ user });
          else {
            context.notify({
              message,
              type: "danger",
              title: "Error"
            });
          }
        });
    } else {
      if (!fullName || !email || !userName || !password) {
        alert("Please make sure each text field is filled in.");
      } else if (!timezone) {
        alert(
          "Error with timezone. Reload page and try again. If error persists, please contact Ghostit."
        );
      }
    }
  };

  render() {
    const { fullName, email, password, passwordConfirm, userName } = this.state;

    return (
      <Consumer>
        {context => (
          <Page
            className="column align-center mt64"
            description="Sign Up"
            keywords=""
            title="Sign Up"
          >
            <GIContainer className="column x-50 bg-white pa64 br16">
              <input
                className="py8 px16 mb8 br4"
                value={fullName}
                onChange={event =>
                  this.handleChange("fullName", event.target.value)
                }
                type="text"
                placeholder="Company Name"
                required
              />

              <input
                className="py8 px16 mb8 br4"
                value={email}
                onChange={event =>
                  this.handleChange("email", event.target.value)
                }
                type="text"
                placeholder="Email"
                required
              />

              <input
                className="py8 px16 mb8 br4"
                value={userName}
                onChange={event =>
                  this.handleChange("userName", event.target.value)
                }
                type="text"
                placeholder="Website"
                required
              />

              <input
                className="py8 px16 mb8 br4"
                value={password}
                onChange={event =>
                  this.handleChange("password", event.target.value)
                }
                placeholder="Password"
                type="password"
                required
              />

              <input
                className="py8 px16 mb8 br4"
                value={passwordConfirm}
                onChange={event =>
                  this.handleChange("passwordConfirm", event.target.value)
                }
                placeholder="Confirm Password"
                type="password"
                required
              />

              <button
                className="bg-blue white py8 mb8 br4"
                onClick={e => this.register(context, e)}
                type="submit"
              >
                Register
              </button>
            </GIContainer>
            <Link className="white mt16" to="/sign-in">
              Sign In Now
            </Link>
          </Page>
        )}
      </Consumer>
    );
  }
}

export default withRouter(RegisterPage);
