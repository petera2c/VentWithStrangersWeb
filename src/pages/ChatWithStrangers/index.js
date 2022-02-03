import React, { useContext, useEffect, useState } from "react";

import { faHandsHelping } from "@fortawesome/pro-duotone-svg-icons/faHandsHelping";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import { getIsMobileOrTablet, userSignUpProgress } from "../../util";
import { joinQueue } from "./util";

function ChatWithStrangersPage() {
  const { user } = useContext(UserContext);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState();
  const [starterModal, setStarterModal] = useState();

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());
  }, []);

  return (
    <Page className="pa16">
      <Container className="">
        <Container className="column flex-fill full-center gap32">
          <Container className="container medium column align-center">
            <h1 className="tac lh-1">Chat With Strangers</h1>
            <p>hello world</p>
          </Container>
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
              <h4 className="grey-11 fw-300 tac">Start Chatting</h4>
            </Container>
          </Container>
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
