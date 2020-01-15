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
    const { socket } = this.context;
    this._ismounted = true;

    socket.emit("get_settings", result => {
      const { settings, success } = result;
      const {
        adultContent,
        postCommented,
        postLiked,
        receiveEmails
      } = settings;

      this.handleChange({
        adultContent,
        postCommented,
        postLiked,
        receiveEmails
      });
    });
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
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

        if (success) this.handleChange({ somethingChanged: false });
        else notify({ message, type: "danger" });
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
            <Input
              className="mr8"
              defaultChecked={postLiked}
              onClick={() =>
                this.handleChange({
                  postLiked: !postLiked,
                  somethingChanged: true
                })
              }
              type="checkbox"
            />
            <Text
              className=""
              text="Notify me when my post recieves a new like"
              type="p"
            />
          </Container>
          <Container className="mb16">
            <Input
              className="mr8"
              defaultChecked={postCommented}
              onClick={() =>
                this.handleChange({
                  postCommented: !postCommented,
                  somethingChanged: true
                })
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
            <Input
              className="mr8"
              defaultChecked={receiveEmails}
              onClick={() =>
                this.handleChange({
                  receiveEmails: !receiveEmails,
                  somethingChanged: true
                })
              }
              type="checkbox"
            />
            <Text
              className=""
              text="Receive periodic emails on important issues"
              type="p"
            />
          </Container>
          <Text
            className="blue bold mb16"
            text="Privacy and Content Preferences"
            type="h6"
          />
          <Container className="mb16">
            <Input
              className="mr8"
              defaultChecked={adultContent}
              onClick={() =>
                this.handleChange({
                  adultContent: !adultContent,
                  somethingChanged: true
                })
              }
              type="checkbox"
            />
            <Text
              className=""
              text="View sensitive/offensive content"
              type="p"
            />
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
