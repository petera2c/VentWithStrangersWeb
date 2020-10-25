import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/database";

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
import Button from "../../components/views/Button";

import { ExtraContext } from "../../context";
import { isMobileOrTablet } from "../../util";

class AccountSection extends Component {
  state = {
    confirmPassword: "",
    displayName: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = (stateObj) => {
    if (this._ismounted) this.setState(stateObj);
  };
  updateUser = () => {
    const {
      confirmPassword,
      displayName,
      email,
      oldPassword,
      newPassword,
    } = this.state;
    const { handleChange, notify, user } = this.context;
    const db = firebase.database();
    console.log("here");
    const userRef = db.ref("/users/" + user.uid);
    userRef.on("value", (snapshot) => {
      console.log(snapshot);
    });
    user
      .updateProfile({
        displayName,
      })
      .then((test) => {
        console.log(test);
      })
      .catch((error) => {
        console.log(error);
      });
    return;

    socket.emit(
      "update_user",
      { confirmPassword, displayName, email, oldPassword, newPassword },
      (result) => {
        const { message, success, user } = result;

        if (success) {
          notify({ message: "Done!", type: "success" });
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
      newPassword,
    } = this.state;
    const { location } = this.props;
    const { pathname, search } = location;

    return (
      <Container
        className={
          "container column px16 " +
          (isMobileOrTablet() ? "mobile-full" : "large")
        }
      >
        <Text className="mb16" text="Account" type="h4" />
        <Container className="column bg-white border-all2 pa16 mb2 br8">
          <Text
            className="blue bold mb16"
            text="Personal Information"
            type="h6"
          />
          <Container className="wrap">
            <Container
              className={
                "column pr8 mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")
              }
            >
              <Text className="mb8" text="Display Name" type="p" />
              <Container className="full-center bg-grey-4 py4 px8 br4">
                <FontAwesomeIcon className="grey-5 mr8" icon={faMonument} />
                <input
                  className="no-border bg-grey-4 br4"
                  onChange={(e) =>
                    this.handleChange({ displayName: e.target.value })
                  }
                  placeholder="Art Vandalay"
                  type="text"
                  value={displayName}
                />
              </Container>
            </Container>
            <Container
              className={
                "column pr8 mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")
              }
            >
              <Text className="mb8 " text="Email" type="p" />
              <Container className="full-center bg-grey-4 py4 px8 br4">
                <FontAwesomeIcon className="grey-5 mr8" icon={faPaperPlane} />
                <input
                  className="no-border bg-grey-4 br4"
                  onChange={(e) => this.handleChange({ email: e.target.value })}
                  placeholder="artvandalay@gmail.com"
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
          <Container
            className={
              "column pr8 mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")
            }
          >
            <Text className="mb8 " text="Old Password" type="p" />
            <Container className="full-center bg-grey-4 py4 px8 br4">
              <FontAwesomeIcon className="grey-5 mr8" icon={faLockAlt} />
              <input
                className="no-border bg-grey-4 br4"
                onChange={(e) =>
                  this.handleChange({ oldPassword: e.target.value })
                }
                placeholder="*******"
                type="password"
                value={oldPassword}
              />
            </Container>
          </Container>
          <Container className="wrap">
            <Container
              className={
                "column pr8 mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")
              }
            >
              <Text className="mb8 " text="New Password" type="p" />
              <Container className="full-center bg-grey-4 py4 px8 br4">
                <FontAwesomeIcon className="grey-5 mr8" icon={faLockAlt} />
                <input
                  className="no-border bg-grey-4 br4"
                  onChange={(e) =>
                    this.handleChange({ newPassword: e.target.value })
                  }
                  placeholder="*******"
                  type="password"
                  value={newPassword}
                />
              </Container>
            </Container>
            <Container
              className={
                "column mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")
              }
            >
              <Text className="mb8 " text="Confirm Password" type="p" />
              <Container className="full-center bg-grey-4 py4 px8 br4">
                <FontAwesomeIcon className="grey-5 mr8" icon={faLockAlt} />
                <input
                  className="no-border bg-grey-4 br4"
                  onChange={(e) =>
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
        <Container className="full-center bg-white border-all2 pa16 br8">
          <Button
            className="cancel py8 px32 mx4 br4"
            text="Cancel"
            onClick={() =>
              this.handleChange({
                confirmPassword: "",
                displayName: "",
                email: "",
                oldPassword: "",
                newPassword: "",
              })
            }
          />
          <Button
            className="button-2 py8 px32 mx4 br4"
            text="Apply"
            onClick={this.updateUser}
          />
        </Container>
      </Container>
    );
  }
}

AccountSection.contextType = ExtraContext;

export default withRouter(AccountSection);
