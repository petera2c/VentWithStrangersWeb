import React, { useContext } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import loadable from "@loadable/component";
import { message } from "antd";
import db from "../../config/firebase";

import { UserContext } from "../../context";
import { isMobileOrTablet } from "../../util";

const Container = loadable(() =>
  import("../../components/containers/Container")
);
const LoadingHeart = loadable(() => import("../../components/loaders/Heart"));
const Page = loadable(() => import("../../components/containers/Page"));
const SubscribeColumn = loadable(() =>
  import("../../components/SubscribeColumn")
);
const Text = loadable(() => import("../../components/views/Text"));

function SettingsSection() {
  const { user } = useContext(UserContext);

  const settingsRef = db.collection("users_settings").doc(user.uid);
  const [settingsSnapshot] = useDocument(settingsRef, {
    idField: "id",
  });

  const handleChange = async (name, checked, notify = true) => {
    await settingsRef.update({ [name]: checked });
    if (notify) message.success("Setting updated!");
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
    <Page className="pa16">
      <Container>
        <Container className="column flex-fill bg-white pa16 mb2 br8">
          <Container className="column">
            <Text
              className="blue bold mb16"
              text="Master Notifications"
              type="h6"
            />
            <Container
              className="clickable align-center mb16"
              onClick={() => {
                handleChange(
                  "master_vent_commented",
                  !settingsSnapshot.data().master_vent_commented
                );
                handleChange(
                  "email_vent_commented",
                  !settingsSnapshot.data().master_vent_commented,
                  false
                );
                handleChange(
                  "mobile_vent_commented",
                  !settingsSnapshot.data().master_vent_commented,
                  false
                );
              }}
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().master_vent_commented}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Recieve a notification when my vent recieves a new comment"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() => {
                handleChange(
                  "master_comment_like",
                  !settingsSnapshot.data().master_comment_like
                );
                handleChange(
                  "email_comment_like",
                  !settingsSnapshot.data().master_comment_like,
                  false
                );
                handleChange(
                  "mobile_comment_like",
                  !settingsSnapshot.data().master_comment_like,
                  false
                );
              }}
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().master_comment_like}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Recieve a notification when my comment recieves a new like"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() => {
                handleChange(
                  "master_vent_like",
                  !settingsSnapshot.data().master_vent_like
                );
                handleChange(
                  "email_vent_like",
                  !settingsSnapshot.data().master_vent_like,
                  false
                );
                handleChange(
                  "mobile_vent_like",
                  !settingsSnapshot.data().master_vent_like,
                  false
                );
              }}
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().master_vent_like}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Recieve a notification when my vent recieves a new like"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() => {
                handleChange(
                  "master_comment_tagged",
                  !settingsSnapshot.data().master_comment_tagged
                );
                handleChange(
                  "email_comment_tagged",
                  !settingsSnapshot.data().master_comment_tagged,
                  false
                );
                handleChange(
                  "mobile_comment_tagged",
                  !settingsSnapshot.data().master_comment_tagged,
                  false
                );
              }}
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().master_comment_tagged}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Recieve a notification when someone tags me in a vent or comment"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() => {
                handleChange(
                  "master_vent_new",
                  !settingsSnapshot.data().master_vent_new
                );
                handleChange(
                  "email_vent_new",
                  !settingsSnapshot.data().master_vent_new,
                  false
                );
                handleChange(
                  "mobile_vent_new",
                  !settingsSnapshot.data().master_vent_new,
                  false
                );
              }}
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().master_vent_new}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Recieve a notification I post a new vent"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() => {
                handleChange(
                  "master_link_sign_up",
                  !settingsSnapshot.data().master_link_sign_up
                );
                handleChange(
                  "email_link_sign_up",
                  !settingsSnapshot.data().email_link_sign_up,
                  false
                );
                handleChange(
                  "mobile_link_sign_up",
                  !settingsSnapshot.data().mobile_link_sign_up,
                  false
                );
              }}
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().master_link_sign_up}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Recieve a notification when a user signs up using your link"
                type="p"
              />
            </Container>
          </Container>

          <Container className="column pl32">
            <Text
              className="blue bold mb16"
              text="Email Notifications"
              type="h6"
            />
            <Container
              className="clickable align-center mb16"
              onClick={() =>
                handleChange(
                  "email_vent_commented",
                  !settingsSnapshot.data().email_vent_commented
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().email_vent_commented}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Email me when my vent recieves a new comment"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() =>
                handleChange(
                  "email_comment_like",
                  !settingsSnapshot.data().email_comment_like
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().email_comment_like}
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
                handleChange(
                  "email_vent_like",
                  !settingsSnapshot.data().email_vent_like
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().email_vent_like}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Email me when my vent recieves a new like"
                type="p"
              />
            </Container>

            <Container
              className="clickable align-center mb16"
              onClick={() =>
                handleChange(
                  "email_comment_tagged",
                  !settingsSnapshot.data().email_comment_tagged
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().email_comment_tagged}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Email me when someone tags me in a vent or comment"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() =>
                handleChange(
                  "email_vent_new",
                  !settingsSnapshot.data().email_vent_new
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().email_vent_new}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Email me when I post a new vent"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() =>
                handleChange(
                  "email_promotions",
                  !settingsSnapshot.data().email_promotions
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().email_promotions}
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
            <Container
              className="clickable align-center mb16"
              onClick={() =>
                handleChange(
                  "email_link_sign_up",
                  !settingsSnapshot.data().email_link_sign_up
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().email_link_sign_up}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Email me when a user signs up using my link"
                type="p"
              />
            </Container>
          </Container>

          <Container className="column pl32">
            <Text
              className="blue bold mb16"
              text="Mobile Push Notifications"
              type="h6"
            />
            <Container
              className="clickable align-center mb16"
              onClick={() =>
                handleChange(
                  "mobile_vent_commented",
                  !settingsSnapshot.data().mobile_vent_commented
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().mobile_vent_commented}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Send a notification to my phone when my vent recieves a new comment"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() =>
                handleChange(
                  "mobile_comment_like",
                  !settingsSnapshot.data().mobile_comment_like
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().mobile_comment_like}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Send a notification to my phone when my comment recieves a new like"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() =>
                handleChange(
                  "mobile_vent_like",
                  !settingsSnapshot.data().mobile_vent_like
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().mobile_vent_like}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Send a notification to my phone when my vent recieves a new like"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() =>
                handleChange(
                  "mobile_comment_tagged",
                  !settingsSnapshot.data().mobile_comment_tagged
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().mobile_comment_tagged}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Send a notification to my phone when someone tags me in a vent or comment"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() =>
                handleChange(
                  "mobile_vent_new",
                  !settingsSnapshot.data().mobile_vent_new
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().mobile_vent_new}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Send a notification to my phone when I post a new vent"
                type="p"
              />
            </Container>
            <Container
              className="clickable align-center mb16"
              onClick={() =>
                handleChange(
                  "mobile_link_sign_up",
                  !settingsSnapshot.data().mobile_link_sign_up
                )
              }
            >
              <input
                className="mr8"
                checked={settingsSnapshot.data().mobile_link_sign_up}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Send a notification when a user signs up using my link"
                type="p"
              />
            </Container>
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
                "offensive_content",
                !settingsSnapshot.data().offensive_content
              )
            }
          >
            <input
              className="mr8"
              checked={settingsSnapshot.data().offensive_content}
              onChange={() => {}}
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
            text="Your private information will never be shared with anyone. Ever."
            type="p"
          />
        </Container>
        <SubscribeColumn slot="1120703532" />
      </Container>
    </Page>
  );
}

export default SettingsSection;
