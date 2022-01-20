import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faWalkieTalkie } from "@fortawesome/pro-duotone-svg-icons/faWalkieTalkie";
import { faHandsHelping } from "@fortawesome/pro-duotone-svg-icons/faHandsHelping";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";
import Text from "../../components/views/Text";

import { UserContext } from "../../context";

import { isMobileOrTablet, useIsMounted, userSignUpProgress } from "../../util";
import {
  conversationsListener,
  countHelpersOrVenters,
  getIsUserInQueue,
  joinQueue,
  leaveQueue,
  queueListener,
} from "./util";

function ChatWithStrangersPage() {
  const { user } = useContext(UserContext);
  const isMounted = useIsMounted();
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [isInQueue, setIsInQueue] = useState(false);
  const [starterModal, setStarterModal] = useState();

  useEffect(() => {
    const queueUnsubscribe = queueListener(isMounted, setQueue);

    let conversationsUnsubscribe;
    if (user) {
      conversationsUnsubscribe = conversationsListener(navigate, user.uid);
      getIsUserInQueue(isMounted, setIsInQueue, user.uid);
    }

    return () => {
      if (conversationsUnsubscribe) conversationsUnsubscribe();
      if (queueUnsubscribe) queueUnsubscribe();
      if (user && isInQueue) leaveQueue(user.uid);
    };
  }, [isInQueue, isMounted, navigate, user]);

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
          <p className="tac py16">
            Hello :) This is a <b className="primary">new page</b>. If you see
            any issues please message <b className="primary">@First</b>
          </p>
          {isInQueue && (
            <p className="tac">
              You are in queue! :) Stay on this page to remain in the queue
            </p>
          )}
        </Container>
        {true && (
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
                <Text
                  className="grey-5 tac"
                  text={
                    countHelpersOrVenters(queue, "helper") +
                    (countHelpersOrVenters(queue, "helper") === 1
                      ? " Person"
                      : " People")
                  }
                  type="p"
                />
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
                <Text
                  className="grey-5 tac"
                  text={
                    countHelpersOrVenters(queue, "venter") +
                    (countHelpersOrVenters(queue, "venter") === 1
                      ? " Person"
                      : " People")
                  }
                  type="p"
                />
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
