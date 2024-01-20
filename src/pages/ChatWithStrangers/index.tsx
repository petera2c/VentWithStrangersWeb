import React, { useContext, useEffect, useState } from "react";

import { faHandsHelping } from "@fortawesome/pro-duotone-svg-icons/faHandsHelping";
import { faPersonToDoor } from "@fortawesome/pro-duotone-svg-icons/faPersonToDoor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import {
  isUserInQueueListener,
  leaveQueue,
} from "../../components/Header/util";
import {
  getIsMobileOrTablet,
  useIsMounted,
  userSignUpProgress,
} from "../../util";
import { joinQueue } from "./util";

function ChatWithStrangersPage() {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState();
  const [isUserInQueue, setIsUserInQueue] = useState();
  const [starterModal, setStarterModal] = useState();

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());

    let isUserInQueueUnsubscribe;

    if (user)
      isUserInQueueUnsubscribe = isUserInQueueListener(
        isMounted,
        setIsUserInQueue,
        user.uid
      );

    return () => {
      if (isUserInQueueUnsubscribe) isUserInQueueUnsubscribe();
    };
  }, [isMounted, user]);

  return (
    <Page className="pa16">
      <Container className="">
        <Container className="column flex-fill full-center gap32">
          <Container className="container medium column align-center bg-white br8 pa32">
            <h1 className="tac">Chat With Strangers</h1>
            <p className="tac">
              This button will only connect you with someone you have no current
              conversations with :)
            </p>
          </Container>
          {isUserInQueue ? (
            <Container
              className="container medium column button-6 bg-white border-all2 br8"
              onClick={() => {
                const userInteractionIssues = userSignUpProgress(user);

                if (userInteractionIssues) {
                  if (userInteractionIssues === "NSI") setStarterModal(true);
                  return;
                }

                leaveQueue(user.uid);
              }}
            >
              <Container
                className={
                  "column x-fill flex-fill full-center " +
                  (isMobileOrTablet ? "py32" : "py64")
                }
              >
                <FontAwesomeIcon
                  className="blue mb8"
                  icon={faPersonToDoor}
                  size="2x"
                />
                <h2 className="ic tac">Leave Queue</h2>
              </Container>
            </Container>
          ) : (
            <Container
              className="container medium column button-6 bg-white border-all2 br8"
              onClick={() => {
                const userInteractionIssues = userSignUpProgress(user);

                if (userInteractionIssues) {
                  if (userInteractionIssues === "NSI") setStarterModal(true);
                  return;
                }

                joinQueue(user.uid);
              }}
            >
              <Container
                className={
                  "column x-fill flex-fill full-center " +
                  (isMobileOrTablet ? "py32" : "py64")
                }
              >
                <FontAwesomeIcon
                  className="blue mb8"
                  icon={faHandsHelping}
                  size="2x"
                />
                <h2 className="ic tac">Start Chatting</h2>
              </Container>
            </Container>
          )}
        </Container>
        <SubscribeColumn slot="1591936277" />
      </Container>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Page>
  );
}

export default ChatWithStrangersPage;
