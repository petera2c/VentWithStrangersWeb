import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMonument } from "@fortawesome/free-solid-svg-icons/faMonument";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";

import Button from "../../components/views/Button";
import Input from "../../components/views/Input";
import Text from "../../components/views/Text";

import Consumer, { ExtraContext } from "../../context";

import { capitolizeFirstChar, isPageActive } from "../../util";

class AccountSection extends Component {
  state = {
    adultContent: undefined,
    postCommented: undefined,
    postLiked: undefined,
    receiveEmails: undefined,
    somethingChanged: false
  };
  componentDidMount() {
    this._ismounted = true;

    const { socket } = this.context;

    socket.emit("get_settings", result => {
      const { settings, success } = result;
      const {
        adultContent,
        postCommented,
        postLiked,
        receiveEmails
      } = settings;

      this.handleChange({
        adultContent: true,
        postCommented: true,
        postLiked: true,
        receiveEmails: true
      });
    });
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObj => {
    stateObj.somethingChanged = true;

    console.log(this._ismounted);
    if (this.ismounted) {
      console.log("here");
      this.setState(stateObj);
    }
  };
  updateSettings = () => {
    const {
      adultContent,
      postCommented,
      postLiked,
      receiveEmails
    } = this.state;
    const { notify, socket } = this.context;

    socket.emit(
      "save_settings",
      { adultContent, postCommented, postLiked, receiveEmails },
      result => {
        const { message, success } = result;
        if (success) notify({ message, type: "danger" });
        else this.handleChange({ somethingChanged: false });
      }
    );
  };

  render() {
    const {
      adultContent,
      postCommented,
      postLiked,
      receiveEmails,
      somethingChanged
    } = this.state;
    const { location } = this.props;
    const { pathname, search } = location;

    return (
      <Container className="container large column pa16">
        <Text className="mb16" text="Settings" type="h4" />
        <Container
          className="column bg-white pa16 mb2"
          style={{
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px"
          }}
        >
          <Text className="blue bold mb16" text="Notifications" type="h6" />
          <Container className="mb8">
            <input
              className="mr8"
              defaultChecked={postLiked}
              onChange={() => this.handleChange({ postLiked: !postLiked })}
              type="checkbox"
            />
            <Text
              className=""
              text="Notify me when my post recieves a new like"
              type="p"
            />
          </Container>
          <Container className="mb16">
            <input
              className="mr8"
              defaultChecked={postCommented}
              onChange={() =>
                this.handleChange({ postCommented: !postCommented })
              }
              type="checkbox"
            />
            <Text
              className=""
              text="Notify me when my post recieves a new comment"
              type="p"
            />
          </Container>
          <Container className="mb16">
            <input
              className="mr8"
              defaultChecked={receiveEmails}
              onChange={() =>
                this.handleChange({ receiveEmails: !receiveEmails })
              }
              type="checkbox"
            />
            <Text
              className=""
              text="Receive very rare emails on important mental health issues"
              type="p"
            />
          </Container>
          <Text
            className="blue bold mb16"
            text="Privacy and Content Preferences"
            type="h6"
          />
          <Container className="mb16">
            <input
              className="mr8"
              defaultChecked={adultContent}
              onChange={() =>
                this.handleChange({ adultContent: !adultContent })
              }
              type="checkbox"
            />
            <Text className="" text="View adult content" type="p" />
          </Container>
          <Text
            className="mb16"
            text="Your information will never be shared with anyone. Ever."
            type="p"
          />
        </Container>
        {somethingChanged && (
          <Container
            className="full-center bg-white pa16"
            style={{
              borderBottomLeftRadius: "4px",
              borderBottomRightRadius: "4px"
            }}
          >
            <Button
              className="button-5 py8 px32 mx4 br4"
              text="Apply"
              onClick={this.updateSettings}
            />
          </Container>
        )}
      </Container>
    );
  }
}

AccountSection.contextType = ExtraContext;

export default withRouter(AccountSection);
