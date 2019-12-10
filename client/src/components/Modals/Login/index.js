import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Consumer from "../../../context";

import axios from "axios";

import VWSContainer from "../../containers/VWSContainer";
import VWSText from "../../views/VWSText";
import VWSButton from "../../views/VWSButton";
import VWSInput from "../../views/VWSInput";

import "./style.css";

class LoginPage extends Component {
  state = {
    email: "",
    password: ""
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

  login = (context, event) => {
    event.preventDefault();
    const { email, password } = this.state;

    if (email && password) {
      axios
        .post("/api/login", { email: email.toLowerCase(), password })
        .then(res => {
          const { message, success, user } = res.data;
          console.log(res.data);

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
    const { email, errorMessage, password } = this.state;

    return (
      <Consumer>
        {context => (
          <VWSContainer className="modal-container full-center">
            <VWSContainer className="modal container-box medium column align-center bg-white br4">
              <VWSContainer className="x-fill justify-center bg-blue py16">
                <VWSText
                  className="tac white"
                  text="Log in to your Account"
                  type="h4"
                />
              </VWSContainer>
              {errorMessage && (
                <VWSContainer>
                  <VWSText text={errorMessage} type="h6" />
                </VWSContainer>
              )}
              <VWSContainer className="x-fill column px32">
                <VWSText className="tac border-bottom py16" text="" type="p">
                  Don't have an account?&nbsp;
                  <VWSText className="blue" type="span">
                    Create One
                  </VWSText>
                </VWSText>

                <VWSContainer className="x-fill column py16">
                  <VWSText className="mb8" text="Email Address" type="h5" />
                  <VWSInput
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
                  <VWSText className="mb8" text="Password" type="h5" />
                  <VWSInput
                    className="py8 px16 mb8 br4"
                    value={password}
                    onChange={e =>
                      this.handleChange("password", e.target.value)
                    }
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </VWSContainer>
              </VWSContainer>
              <VWSContainer className="x-fill full-center px32 py16">
                <VWSButton
                  className="x-fill bg-blue white py8 br4"
                  onClick={e => this.login(context, e)}
                  text="Log in"
                />
              </VWSContainer>
            </VWSContainer>
            <VWSContainer className="modal-background" />
          </VWSContainer>
        )}
      </Consumer>
    );
  }
}

export default withRouter(LoginPage);
