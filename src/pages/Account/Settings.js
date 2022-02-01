import React, { useContext, useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import loadable from "@loadable/component";
import { message } from "antd";
import db from "../../config/firebase";

import { UserContext } from "../../context";

const Container = loadable(() =>
  import("../../components/containers/Container")
);
const LoadingHeart = loadable(() => import("../../components/loaders/Heart"));
const Page = loadable(() => import("../../components/containers/Page"));
const SubscribeColumn = loadable(() =>
  import("../../components/SubscribeColumn")
);

function SettingsSection() {
  const { user } = useContext(UserContext);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState();

  const settingsRef = db.collection("users_settings").doc(user.uid);
  const [settingsSnapshot] = useDocument(settingsRef, {
    idField: "id",
  });

  const handleChange = async (name, checked, notify = true) => {
    await settingsRef.update({ [name]: checked });
    if (notify) message.success("Setting updated!");
  };

  useEffect(() => {
    import("../../util").then((functions) => {
      setIsMobileOrTablet(functions.getIsMobileOrTablet());
    });
  }, []);

  if (!settingsSnapshot || !settingsSnapshot.data())
    return (
      <Container
        className={
          "align-center container column px16 " +
          (isMobileOrTablet ? "mobile-full" : "large")
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
            <h6 className="blue bold mb16">Master Notifications</h6>
            <Setting
              description="Recieve a notification I post a new vent"
              handleChange={handleChange}
              setAll
              setting="vent_new"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my vent recieves a new comment"
              handleChange={handleChange}
              setAll
              setting="vent_commented"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my vent recieves a new like"
              handleChange={handleChange}
              setAll
              setting="vent_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when someone tags me in a vent or comment"
              handleChange={handleChange}
              setAll
              setting="comment_tagged"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my comment recieves a new like"
              handleChange={handleChange}
              setAll
              setting="comment_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my quote recieves a new like"
              handleChange={handleChange}
              setAll
              setting="quote_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when a user signs up using my unique link"
              handleChange={handleChange}
              setAll
              setting="link_sign_up"
              settingsSnapshot={settingsSnapshot}
            />
          </Container>

          <Container className="column pl32">
            <h6 className="blue bold mb16">Email Notifications</h6>
            <Setting
              description="Email me when I post a new vent"
              handleChange={handleChange}
              setting="email_vent_new"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my vent recieves a new comment"
              handleChange={handleChange}
              setting="email_vent_commented"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my vent recieves a new like"
              handleChange={handleChange}
              setting="email_vent_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when someone tags me in a vent or comment"
              handleChange={handleChange}
              setting="email_comment_tagged"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my comment recieves a new like"
              handleChange={handleChange}
              setting="email_comment_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my quote recieves a new like"
              handleChange={handleChange}
              setting="email_quote_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when a user signs up using my link"
              handleChange={handleChange}
              setting="email_link_sign_up"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Receive periodic emails on important issues"
              handleChange={handleChange}
              setting="email_promotions"
              settingsSnapshot={settingsSnapshot}
            />
          </Container>

          <Container className="column pl32">
            <h6 className="blue bold mb16">Mobile Push Notifications</h6>
            <Setting
              description="Send a notification to my phone when I post a new vent"
              handleChange={handleChange}
              setting="mobile_vent_new"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my vent recieves a new comment"
              handleChange={handleChange}
              setting="mobile_vent_commented"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my vent recieves a new like"
              handleChange={handleChange}
              setting="mobile_vent_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when someone tags me in a vent or comment"
              handleChange={handleChange}
              setting="mobile_comment_tagged"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my comment recieves a new like"
              handleChange={handleChange}
              setting="mobile_comment_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my quote recieves a new like"
              handleChange={handleChange}
              setting="mobile_quote_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification when a user signs up using my link"
              handleChange={handleChange}
              setting="mobile_link_sign_up"
              settingsSnapshot={settingsSnapshot}
            />
          </Container>
          <h6 className="blue bold mb16">Privacy and Content Preferences</h6>
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
            <p>View sensitive/offensive content</p>
          </Container>
          <p className="mb16">
            Your private information will never be shared with anyone. Ever.
          </p>
        </Container>
        <SubscribeColumn slot="1120703532" />
      </Container>
    </Page>
  );
}

function Setting({
  description,
  handleChange,
  setAll,
  settingsSnapshot,
  setting,
}) {
  const master = "master_" + setting;
  const mobile = "mobile_" + setting;
  const email = "email_" + setting;

  let main = master;
  if (!setAll) main = setting;

  return (
    <Container
      className="clickable align-center mb16"
      onClick={() => {
        if (setAll) {
          handleChange(master, !settingsSnapshot.data()[master]);
          handleChange(email, !settingsSnapshot.data()[master], false);
          handleChange(mobile, !settingsSnapshot.data()[master], false);
        } else handleChange(main, !settingsSnapshot.data()[main]);
      }}
    >
      <input
        className="mr8"
        checked={settingsSnapshot.data()[main]}
        onChange={() => {}}
        style={{ minWidth: "13px" }}
        type="checkbox"
      />
      <p>{description}</p>
    </Container>
  );
}

export default SettingsSection;
