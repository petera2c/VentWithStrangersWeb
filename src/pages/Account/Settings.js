import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/database";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMonument } from "@fortawesome/free-solid-svg-icons/faMonument";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";

import Button from "../../components/views/Button";
import Text from "../../components/views/Text";

import Consumer, { ExtraContext } from "../../context";

import { isMobileOrTablet } from "../../util";

class AccountSection extends Component {
  state = {
    adultContent: false,
    commentLiked: true,
    postCommented: true,
    postLiked: true,
    receiveEmails: true,
    somethingChanged: false,
  };
  componentDidMount() {
    const { user } = this.context;
    this._ismounted = true;

    const db = firebase.database();

    const userRef = db.ref("/users/" + user.uid);
    userRef.on("value", (snapshot) => {
      console.log(snapshot);

      const value = snapshot.val();
      const exists = snapshot.exists();
    });

    /*  this.handleChange({
        adultContent,
        commentLiked,
        postCommented,
        postLiked,
        receiveEmails,
      });*/
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = (stateObj) => {
    if (this._ismounted) this.setState(stateObj);
  };
  updateSettings = () => {
    const {
      adultContent,
      commentLiked,
      postCommented,
      postLiked,
      receiveEmails,
    } = this.state;
    const { notify, user } = this.context;
    const db = firebase.database();

    db.ref("users/" + user.uid).set({
      settings: {
        adultContent,
        commentLiked,
        postCommented,
        postLiked,
        receiveEmails,
      },
    });
  };

  render() {
    const {
      adultContent,
      commentLiked,
      postCommented,
      postLiked,
      receiveEmails,
      somethingChanged,
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
        <Text className="mb16" text="Settings" type="h4" />
        <Container className="column bg-white border-all2 pa16 mb2 br8">
          <Text className="blue bold mb16" text="Notifications" type="h6" />
          <Container
            className="clickable align-center mb16"
            onClick={() =>
              this.handleChange({
                postCommented: !postCommented,
                somethingChanged: true,
              })
            }
          >
            <input
              className="mr8"
              defaultChecked={postCommented}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <Text
              className=""
              text="Email me when my post recieves a new comment"
              type="p"
            />
          </Container>
          <Container
            className="clickable align-center mb16"
            onClick={() =>
              this.handleChange({
                commentLiked: !commentLiked,
                somethingChanged: true,
              })
            }
          >
            <input
              className="mr8"
              defaultChecked={commentLiked}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <Text
              className=""
              text="Email me when my comment recieves a new like"
              type="p"
            />
          </Container>
          <Container
            className="clickable align-center mb16"
            onClick={() =>
              this.handleChange({
                postLiked: !postLiked,
                somethingChanged: true,
              })
            }
          >
            <input
              className="mr8"
              defaultChecked={postLiked}
              style={{ minWidth: "13px" }}
              type="checkbox"
            />
            <Text
              className=""
              text="Email me when my post recieves a new like"
              type="p"
            />
          </Container>
          <Container
            className="clickable align-center mb16"
            onClick={() =>
              this.handleChange({
                receiveEmails: !receiveEmails,
                somethingChanged: true,
              })
            }
          >
            <input
              className="mr8"
              defaultChecked={receiveEmails}
              style={{ minWidth: "13px" }}
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
          <Container
            className="clickable align-center mb16"
            onClick={() =>
              this.handleChange({
                adultContent: !adultContent,
                somethingChanged: true,
              })
            }
          >
            <input
              className="mr8"
              defaultChecked={adultContent}
              style={{ minWidth: "13px" }}
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
          <Container className="full-center bg-white border-all2 pa16 br8">
            <Button
              className="button-2 py8 px32 mx4 br4"
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