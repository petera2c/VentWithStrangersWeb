import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faLockAlt } from "@fortawesome/pro-solid-svg-icons/faLockAlt";
import { faPaperPlane } from "@fortawesome/pro-light-svg-icons/faPaperPlane";
import { faMonument } from "@fortawesome/pro-light-svg-icons/faMonument";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";
import Input from "../../components/views/Input";
import Button from "../../components/views/Button";

import Consumer, { ExtraContext } from "../../context";

import { capitolizeFirstChar, isPageActive } from "../../util";

class AccountSection extends Component {
  state = {
    confirmPassword: "",
    displayName: "",
    email: "",
    oldPassword: "",
    newPassword: ""
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };
  updateUser = () => {
    const {
      confirmPassword,
      displayName,
      email,
      oldPassword,
      newPassword
    } = this.state;
    const { handleChange, notify, socket } = this.context;

    socket.emit(
      "update_user",
      { confirmPassword, displayName, email, oldPassword, newPassword },
      result => {
        const { message, success } = result;

        if (success) {
          notify({ message, type: "success" });
          handleChange({ user });
        } else notify({ message, type: "danger" });
      }
    );
  };
  render() {
    const {
      confirmPassword,
      displayName,
      email,
      oldPassword,
      newPassword
    } = this.state;
    const { location } = this.props;
    const { pathname, search } = location;

    return (
      <Consumer>
        {context => (
          <Container className="container large column pa16">
            <Text className="mb16" text="Account" type="h4" />
            <Container
              className="column bg-white pa16 mb2"
              style={{
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px"
              }}
            >
              <Text
                className="blue bold mb16"
                text="Personal Information"
                type="h6"
              />
              <Container>
                <Container className="x-50 column pr8 mb16">
                  <Text className="mb8 " text="Display Name" type="p" />
                  <Container className="full-center bg-grey-4 py4 px8 br4">
                    <FontAwesomeIcon className="grey-5 mr8" icon={faMonument} />
                    <Input
                      className="no-border bg-grey-4 br4"
                      onChange={e =>
                        this.handleChange({ displayName: e.target.value })
                      }
                      placeholder="batman360"
                      type="text"
                      value={displayName}
                    />
                  </Container>
                </Container>
                <Container className="x-50 column pr8 mb16">
                  <Text className="mb8 " text="Email" type="p" />
                  <Container className="full-center bg-grey-4 py4 px8 br4">
                    <FontAwesomeIcon
                      className="grey-5 mr8"
                      icon={faPaperPlane}
                    />
                    <Input
                      className="no-border bg-grey-4 br4"
                      onChange={e =>
                        this.handleChange({ email: e.target.value })
                      }
                      placeholder="batman360@gmail.com"
                      type="text"
                      value={email}
                    />
                  </Container>
                </Container>
              </Container>
              <Text
                className="blue bold mb16"
                text="Change your Password"
                type="h6"
              />
              <Container className="x-50 column pr8 mb16">
                <Text className="mb8 " text="Old Password" type="p" />
                <Container className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faLockAlt} />
                  <Input
                    className="no-border bg-grey-4 br4"
                    onChange={e =>
                      this.handleChange({ oldPassword: e.target.value })
                    }
                    placeholder="*******"
                    type="password"
                    value={oldPassword}
                  />
                </Container>
              </Container>
              <Container>
                <Container className="x-50 column pr8 mb16">
                  <Text className="mb8 " text="New Password" type="p" />
                  <Container className="full-center bg-grey-4 py4 px8 br4">
                    <FontAwesomeIcon className="grey-5 mr8" icon={faLockAlt} />
                    <Input
                      className="no-border bg-grey-4 br4"
                      onChange={e =>
                        this.handleChange({ newPassword: e.target.value })
                      }
                      placeholder="*******"
                      type="password"
                      value={newPassword}
                    />
                  </Container>
                </Container>
                <Container className="x-50 column mb16">
                  <Text className="mb8 " text="Confirm Password" type="p" />
                  <Container className="full-center bg-grey-4 py4 px8 br4">
                    <FontAwesomeIcon className="grey-5 mr8" icon={faLockAlt} />
                    <Input
                      className="no-border bg-grey-4 br4"
                      onChange={e =>
                        this.handleChange({ confirmPassword: e.target.value })
                      }
                      placeholder="*******"
                      type="password"
                      value={confirmPassword}
                    />
                  </Container>
                </Container>
              </Container>
            </Container>
            <Container
              className="full-center bg-white pa16"
              style={{
                borderBottomLeftRadius: "4px",
                borderBottomRightRadius: "4px"
              }}
            >
              <Button
                className="cancel py8 px32 mx4 br4"
                text="Cancel"
                onClick={() =>
                  this.handleChange({
                    confirmPassword: "",
                    displayName: "",
                    email: "",
                    oldPassword: "",
                    newPassword: ""
                  })
                }
              />
              <Button
                className="button-5 py8 px32 mx4 br4"
                text="Apply"
                onClick={this.updateUser}
              />
            </Container>
          </Container>
        )}
      </Consumer>
    );
  }
}

AccountSection.contextType = ExtraContext;

export default withRouter(AccountSection);
