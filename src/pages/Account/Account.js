import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import db from "../../config/firebase";

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

import { isMobileOrTablet } from "../../util";

function AccountSection({ user }) {
  const history = useHistory();
  if (!user) {
    history.push("/");
    return <div />;
  }

  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateUser = () => {
    if (displayName && displayName !== user.displayName) {
      user
        .updateProfile({
          displayName
        })
        .then(async () => {
          await db
            .collection("users_display_name")
            .doc(user.uid)
            .update({ displayName });
          alert("Display name updated!");
        })
        .catch(error => {
          alert(error.message);
        });
    }

    if (email && email !== user.email) {
      user
        .updateEmail(email)
        .then(() => {
          user
            .sendEmailVerification()
            .then(() => {
              alert("We have sent you an email verification link");
            })
            .catch(error => {
              // An error happened.
            });
        })
        .catch(error => {
          alert(error.message);
        });
    }
    if (newPassword && confirmPassword)
      if (newPassword === confirmPassword)
        user
          .updatePassword(newPassword)
          .then(() => {
            alert("Changed password successfully!");
          })
          .catch(error => {
            alert(error.message);
          });
      else alert("Passwords are not the same!");
  };

  return (
    <Container
      className={
        "container column px16 " +
        (isMobileOrTablet() ? "mobile-full" : "large")
      }
    >
      <Text className="mb16" text="Account" type="h4" />
      <Container className="column bg-white pa16 mb2 br8">
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
                onChange={e => setDisplayName(e.target.value)}
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
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setNewPassword(e.target.value)}
                placeholder="*******"
                type="password"
                value={newPassword}
              />
            </Container>
          </Container>
          <Container
            className={"column mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")}
          >
            <Text className="mb8 " text="Confirm Password" type="p" />
            <Container className="full-center bg-grey-4 py4 px8 br4">
              <FontAwesomeIcon className="grey-5 mr8" icon={faLockAlt} />
              <input
                className="no-border bg-grey-4 br4"
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="*******"
                type="password"
                value={confirmPassword}
              />
            </Container>
          </Container>
        </Container>
      </Container>
      <Container className="full-center bg-white pa16 br8">
        <Button
          className="cancel py8 px32 mx4 br4"
          text="Cancel"
          onClick={() => {
            setDisplayName(user.displayName);
            setEmail(user.email);
            setNewPassword("");
            setConfirmPassword("");
          }}
        />
        <Button
          className="button-2 py8 px32 mx4 br4"
          text="Apply"
          onClick={updateUser}
        />
      </Container>
    </Container>
  );
}

export default AccountSection;
