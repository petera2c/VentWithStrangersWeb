import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import Consumer from "../../../context";

import Container from "../../containers/Container";
import Text from "../../views/Text";
import Button from "../../views/Button";
import Input from "../../views/Input";

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

  handleChange = stateObj => {
    this.setState(stateObj);
  };

  login = (context, event) => {
    const { email, password } = this.state;

    if (email && password) {
      axios
        .post("/api/login", { username: email.toLowerCase(), password })
        .then(res => {
          const { message, success, user } = res.data;

          if (success) {
            window.location.reload();
          } else {
            context.notify({
              message,
              type: "danger",
              title: "Something went wrong!"
            });
          }
        });
    } else {
      context.notify({
        message: "missing email or password",
        type: "danger",
        title: "Something went wrong!"
      });
    }
  };

  render() {
    const { email, errorMessage, password } = this.state;
    const { close, openSignUpModal } = this.props;

    return (
      <Consumer>
        {context => (
          <Container className="modal-container full-center">
            <Container className="modal container medium column align-center bg-white br4">
              <Container className="x-fill justify-center bg-blue py16">
                <Text
                  className="tac white"
                  text="Log in to your Account"
                  type="h4"
                />
              </Container>
              {errorMessage && (
                <Container>
                  <Text text={errorMessage} type="h6" />
                </Container>
              )}
              <Container className="x-fill column">
                <Container className="x-fill full-center px32">
                  <Text className="x-fill tac border-bottom py16" type="p">
                    Don't have an account?&nbsp;
                    <Text
                      className="clickable blue"
                      onClick={() => openSignUpModal()}
                      type="span"
                    >
                      Create One
                    </Text>
                  </Text>
                </Container>
                <form
                  className="x-fill column"
                  onSubmit={e => e.preventDefault()}
                >
                  <Container className="x-fill column px32 py16">
                    <Text className="mb8" text="Email Address" type="h5" />
                    <Input
                      className="py8 px16 mb8 br4"
                      value={email}
                      onChange={event =>
                        this.handleChange({ email: event.target.value })
                      }
                      type="text"
                      name="email"
                      placeholder="Email"
                      required
                    />
                    <Text className="mb8" text="Password" type="h5" />
                    <Input
                      className="py8 px16 mb8 br4"
                      value={password}
                      onChange={e =>
                        this.handleChange({ password: e.target.value })
                      }
                      name="password"
                      type="password"
                      placeholder="Password"
                      required
                    />
                  </Container>
                  <Container className="x-fill full-center border-top px32 py16">
                    <Button
                      className="x-fill bg-blue white py8 br4"
                      onClick={e => this.login(context, e)}
                      text="Log in"
                    />
                  </Container>
                </form>
              </Container>
            </Container>
            <Container className="modal-background" onClick={close} />
          </Container>
        )}
      </Consumer>
    );
  }
}

export default withRouter(LoginPage);
