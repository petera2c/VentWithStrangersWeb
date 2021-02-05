import React, { useEffect, useState, useContext } from "react";
import firebase from "firebase/app";
import "firebase/database";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMonument } from "@fortawesome/free-solid-svg-icons/faMonument";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import LoadingHeart from "../../components/loaders/Heart";

import Button from "../../components/views/Button";
import Text from "../../components/views/Text";

import { UserContext } from "../../context";

import { isMobileOrTablet } from "../../util";

function AccountSection() {
  const [settings, setSettings] = useState();
  const user = useContext(UserContext);
  const db = firebase.database();

  const settingsRef = db.ref("/users/" + user.uid + "/settings");

  useEffect(() => {
    settingsRef.on("value", snapshot => {
      const value = snapshot.val();
      const exists = snapshot.exists();
      if (exists) setSettings(value);
    });
  }, [user]);

  const handleChange = e => {
    const { name, checked } = e.target;

    settingsRef.child(name).set(checked);
  };

  if (!settings)
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
        <Container className="align-center mb16">
          <input
            className="mr8"
            checked={settings.postCommented}
            name="postCommented"
            onChange={e => handleChange(e)}
            style={{ minWidth: "13px" }}
            type="checkbox"
          />
          <Text
            className=""
            text="Email me when my post recieves a new comment"
            type="p"
          />
        </Container>
        <Container className="align-center mb16">
          <input
            className="mr8"
            checked={settings.commentLiked}
            name="commentLiked"
            onChange={e => handleChange(e)}
            style={{ minWidth: "13px" }}
            type="checkbox"
          />
          <Text
            className=""
            text="Email me when my comment recieves a new like"
            type="p"
          />
        </Container>
        <Container className="align-center mb16">
          <input
            className="mr8"
            checked={settings.postLiked}
            name="postLiked"
            onChange={e => handleChange(e)}
            style={{ minWidth: "13px" }}
            type="checkbox"
          />
          <Text
            className=""
            text="Email me when my post recieves a new like"
            type="p"
          />
        </Container>
        <Container className="align-center mb16">
          <input
            className="mr8"
            checked={settings.receiveEmails}
            name="receiveEmails"
            onChange={e => handleChange(e)}
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
        <Container className="align-center mb16">
          <input
            className="mr8"
            checked={settings.adultContent}
            name="adultContent"
            onChange={e => handleChange(e)}
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
