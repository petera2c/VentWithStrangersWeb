import React, { useContext, useEffect, useState } from "react";
import loadable from "@loadable/component";

import { useNavigate } from "react-router-dom";
import { faWalkieTalkie } from "@fortawesome/pro-duotone-svg-icons/faWalkieTalkie";
import { faHandsHelping } from "@fortawesome/pro-duotone-svg-icons/faHandsHelping";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import { startConversation } from "../../components/Vent/util";
import { isMobileOrTablet, useIsMounted, userSignUpProgress } from "../../util";
import {
  conversationsListener,
  countHelpersOrVenters,
  joinQueue,
} from "./util";

const Container = loadable(() =>
  import("../../components/containers/Container")
);
const Page = loadable(() => import("../../components/containers/Page"));
const StarterModal = loadable(() => import("../../components/modals/Starter"));
const Text = loadable(() => import("../../components/views/Text"));

function ChatWithStrangersPage() {
  const { user } = useContext(UserContext);
  const isMounted = useIsMounted();
  const navigate = useNavigate();

  const [starterModal, setStarterModal] = useState();

  return (
    <Page className="pa16">
      <Container className="">
        <Container className="column flex-fill full-center gap32">
          <Container className="container medium column align-center">
            <h1 className="tac lh-1">Chat With Strangers</h1>
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
                (isMobileOrTablet() ? "py32" : "py64")
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
