import React, { useContext, useEffect, useState } from "react";

import { faWalkieTalkie } from "@fortawesome/pro-duotone-svg-icons/faWalkieTalkie";
import { faHandsHelping } from "@fortawesome/pro-duotone-svg-icons/faHandsHelping";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";
import Text from "../../components/views/Text";

import { UserContext } from "../../context";

import { isMobileOrTablet, userSignUpProgress } from "../../util";
import { isInQueue, joinQueue, leaveQueue } from "./util";

function ChatWithStrangersPage() {
  const { user } = useContext(UserContext);

  const [isInQueue, setIsInQueue] = useState(false);
  const [starterModal, setStarterModal] = useState();

  useEffect(() => {
    return () => {
      if (user && isInQueue) leaveQueue(user.uid);
    };
  }, []);

  return (
    <Page
      className="pa16"
      description="Sometimes, all we need is an available ear. This is where you can anonymously talk to someone that wants to listen, or anonymously listen to someone that wants to be heard."
      title="Chat With Strangers"
    >
      <Container
        className={
          "column align-center gap32 " + (isMobileOrTablet() ? "pt16" : "pt64")
        }
      >
        <Container className="container medium column">
          <h1 className="tac">Chat With Strangers</h1>
          {false && (
            <p className="tac">
              After joining you can go to the rest of the site. When a user is
              connected you will be redirected to your chat :)
            </p>
          )}
        </Container>
        {!isInQueue && (
          <Container className="wrap full-center gap16">
            <Container
              className="container small column button-6 bg-white border-all2 br8"
              onClick={() => {
                const userInteractionIssues = userSignUpProgress(user);

                if (userInteractionIssues) {
                  if (userInteractionIssues === "NSI") setStarterModal(true);
                  return;
                }

                joinQueue("helper", setIsInQueue, user.uid);
              }}
            >
              <Container
                className={
                  "column x-fill flex-fill full-center border-bottom " +
                  (isMobileOrTablet() ? "py32" : "py64")
                }
              >
                <FontAwesomeIcon
                  className="blue mb8"
                  icon={faHandsHelping}
                  size="2x"
                />
                <Text
                  className="grey-11 fw-300 tac"
                  text="Help a Stranger"
                  type="h3"
                />
              </Container>
              <Container className="column x-fill full-center py16">
                <Text
                  className="grey-3 fw-300 tac"
                  text="Listeners Waiting"
                  type="h5"
                />
                <Text className="grey-5 tac" text={0 + " People"} type="p" />
              </Container>
            </Container>
            <Container
              className="container small column button-6 bg-white border-all2 br8"
              onClick={() => {
                const userInteractionIssues = userSignUpProgress(user);

                if (userInteractionIssues) {
                  if (userInteractionIssues === "NSI") setStarterModal(true);
                  return;
                }

                joinQueue("venter", setIsInQueue, user.uid);
              }}
            >
              <Container
                className={
                  "column x-fill flex-fill full-center border-bottom " +
                  (isMobileOrTablet() ? "py32" : "py64")
                }
              >
                <FontAwesomeIcon
                  className="blue mb8"
                  icon={faWalkieTalkie}
                  size="2x"
                />
                <Text
                  className="grey-11 fw-300 tac"
                  text="Vent to a Stranger"
                  type="h3"
                />
              </Container>
              <Container className="column x-fill full-center py16">
                <Text
                  className="grey-3 fw-300 tac"
                  text="Venters Waiting"
                  type="h5"
                />
                <Text className="grey-5 tac" text={0 + " People"} type="p" />
              </Container>
            </Container>
          </Container>
        )}
      </Container>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}{" "}
    </Page>
  );
}

export default ChatWithStrangersPage;
