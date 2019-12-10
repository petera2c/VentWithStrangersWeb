import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Consumer, { ExtraContext } from "../../../context";

import axios from "axios";

import VWSContainer from "../../containers/VWSContainer";

import VWSText from "../../views/VWSText";
import VWSButton from "../../views/VWSButton";

import { validateEmail } from "./util";

let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

class RegisterPage extends Component {
  state = {
    email: "",
    displayName: "",
    timezone: timezone ? timezone : "America/Vancouver",
    password: "",
    passwordConfirm: ""
  };

  componentDidMount() {
    const { history } = this.props;
    const { user } = this.context; // Variables
    const { notify } = this.context; // Functions

    if (user && user.displayName && user.displayName.match(/[a-z]/i)) {
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
      email,
      timezone,
      password,
      passwordConfirm,
      displayName
    } = this.state;

    if (!validateEmail(email)) {
      alert("Not a real email address!");
      return;
    }

    if (email && displayName && timezone && password) {
      if (password !== passwordConfirm) {
        alert("Passwords do not match.");
        return;
      }
      axios
        .post("/api/register", {
          email: email.toLowerCase(),
          displayName,
          timezone,
          password
        })
        .then(res => {
          const { success, user, message } = res.data;
          const { handleChange, notify } = this.context;
          const { history } = this.props;
          console.log(res.data);

          if (success && user) {
            handleChange({ user });
            history.push("/home");
          } else {
            notify({
              message,
              type: "danger",
              title: "Error"
            });
          }
        });
    } else {
      if (!email || !displayName || !password) {
        alert("Please make sure each text field is filled in.");
      } else if (!timezone) {
        alert(
          "Error with timezone. Reload page and try again. If error persists, please contact Ghostit."
        );
      }
    }
  };

  render() {
    const { email, password, passwordConfirm, displayName } = this.state;

    return (
      <Consumer>
        {context => (
          <VWSContainer
            className="column align-center mt64"
            description="Sign Up"
            keywords=""
            title="Sign Up"
          >
            <VWSContainer className="column x-50 bg-white pa64 br16">
              <input
                className="py8 px16 mb8 br4"
                value={displayName}
                onChange={event =>
                  this.handleChange("displayName", event.target.value)
                }
                type="text"
                placeholder="Display Name"
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
            </VWSContainer>
            <Link className="white mt16" to="/login">
              Sign In Now
            </Link>
          </VWSContainer>
        )}
      </Consumer>
    );
  }
}

RegisterPage.contextType = ExtraContext;

export default withRouter(RegisterPage);
