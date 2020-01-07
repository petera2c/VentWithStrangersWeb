import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import Consumer, { ExtraContext } from "../../../context";

import Container from "../../containers/Container";
import Text from "../../views/Text";
import Button from "../../views/Button";
import Input from "../../views/Input";

import { validateEmail } from "./util";

let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

class SignUpModal extends Component {
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

    if (user && user.password) {
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

  register = (context, event) => {
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
          const { success, message } = res.data;
          const { handleChange, notify } = this.context;
          const { close, history } = this.props;

          if (success) {
            window.location.reload();
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
    const {
      displayName,
      email,
      errorMessage,
      password,
      passwordConfirm
    } = this.state;
    const { close, openLoginModal } = this.props;

    return (
      <Consumer>
        {context => (
          <Container className="modal-container full-center">
            <Container className="modal container medium column align-center bg-white br4">
              <Container className="x-fill justify-center bg-blue py16">
                <Text
                  className="tac white"
                  text="Create an Account"
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
                      onClick={() => openLoginModal()}
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
                    <Text className="mb8" text="Display Name" type="h5" />
                    <Input
                      className="py8 px16 mb8 br4"
                      value={displayName}
                      onChange={event =>
                        this.handleChange({ displayName: event.target.value })
                      }
                      type="text"
                      name="name"
                      placeholder="Bunny_Smith"
                      required
                    />
                    <Text className="mb8" text="Email Address" type="h5" />
                    <Input
                      className="py8 px16 mb8 br4"
                      value={email}
                      onChange={e =>
                        this.handleChange({ email: e.target.value })
                      }
                      name="email"
                      type="text"
                      placeholder="bunnysmith@gmail.com"
                      required
                    />
                    <Container>
                      <Container className="fill-flex column mr16">
                        <Text className="mb8" text="Password" type="h5" />
                        <Input
                          className="py8 px16 mb8 br4"
                          value={password}
                          onChange={e =>
                            this.handleChange({ password: e.target.value })
                          }
                          name="password"
                          type="password"
                          placeholder="********"
                          required
                        />
                      </Container>
                      <Container className="fill-flex column">
                        <Text
                          className="mb8"
                          text="Confirm Password"
                          type="h5"
                        />
                        <Input
                          className="py8 px16 mb8 br4"
                          value={passwordConfirm}
                          onChange={e =>
                            this.handleChange({
                              passwordConfirm: e.target.value
                            })
                          }
                          name="passwordConfirm"
                          type="password"
                          placeholder="********"
                          required
                        />
                      </Container>
                    </Container>
                  </Container>
                  <Container className="x-fill full-center border-top px32 py16">
                    <Button
                      className="x-fill bg-blue white py8 br4"
                      onClick={e => this.register(context, e)}
                      text="Create Account"
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

SignUpModal.contextType = ExtraContext;

export default withRouter(SignUpModal);
