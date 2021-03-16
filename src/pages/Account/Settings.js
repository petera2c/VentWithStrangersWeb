import React, { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";
import db from "../../config/firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMonument } from "@fortawesome/free-solid-svg-icons/faMonument";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import LoadingHeart from "../../components/loaders/Heart";

import Button from "../../components/views/Button";
import Text from "../../components/views/Text";

import { isMobileOrTablet } from "../../util";

function AccountSection({ user }) {
  const history = useHistory();
  if (!user) {
    history.push("/");
    return <div />;
  }

  const settingsRef = db.collection("users").doc(user.uid);
  const [settingsSnapshot] = useDocument(settingsRef, {
    idField: "id"
  });

  const handleChange = async (name, checked) => {
    await settingsRef.update({ [name]: checked });
    alert("Setting updated!");
  };

  if (!settingsSnapshot || !settingsSnapshot.data())
    return (
      <Container
        className={
          "align-center container column px16 " +
          (isMobileOrTablet() ? "mobile-full" : "large")
        }
      >
        <LoadingHeart />
      </Container>
    );

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
            handleChange(
              "post_commented",
              !settingsSnapshot.data().post_commented
            )
          }
        >
          <input
            className="mr8"
            checked={settingsSnapshot.data().post_commented}
            name="post_commented"
            onChange={() => {}}
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
            handleChange(
              "comment_liked",
              !settingsSnapshot.data().comment_liked
            )
          }
        >
          <input
            className="mr8"
            checked={settingsSnapshot.data().comment_liked}
            name="comment_liked"
            onChange={() => {}}
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
            handleChange("post_liked", !settingsSnapshot.data().post_liked)
          }
        >
          <input
            className="mr8"
            checked={settingsSnapshot.data().post_liked}
            name="post_liked"
            onChange={() => {}}
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
            handleChange(
              "receive_emails",
              !settingsSnapshot.data().receive_emails
            )
          }
        >
          <input
            className="mr8"
            checked={settingsSnapshot.data().receive_emails}
            name="receive_emails"
            onChange={() => {}}
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
            handleChange(
              "adult_content",
              !settingsSnapshot.data().adult_content
            )
          }
        >
          <input
            className="mr8"
            checked={settingsSnapshot.data().adult_content}
            name="adult_content"
            onChange={() => {}}
            style={{ minWidth: "13px" }}
            type="checkbox"
          />
          <Text className="" text="View sensitive/offensive content" type="p" />
        </Container>
        <Text
          className="mb16"
          text="Your information will never be shared with anyone. Ever."
          type="p"
        />
      </Container>
    </Container>
  );
}

export default AccountSection;
