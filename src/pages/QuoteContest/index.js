import React, { useContext, useEffect, useState } from "react";
import TextArea from "react-textarea-autosize";

import { Button, message } from "antd";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import {
  calculateKarma,
  isMobileOrTablet,
  useIsMounted,
  userSignUpProgress,
} from "../../util";
import { getCanUserCreateQuote, saveQuote } from "./util";

function QuoteContestPage() {
  const isMounted = useIsMounted();
  const { user, userBasicInfo } = useContext(UserContext);

  const [canUserCreateQuote, setCanUserCreateQuote] = useState(true);
  const [myQuote, setMyQuote] = useState("");
  const [quoteID, setQuoteID] = useState();
  const [starterModal, setStarterModal] = useState();

  useEffect(() => {
    if (user) getCanUserCreateQuote(isMounted, setCanUserCreateQuote, user.uid);
  }, []);

  return (
    <Page className="pa16">
      <Container className="gap8">
        <Container className="column flex-fill">
          <Container className="column gap8 pa16">
            <h1 className="tac">Daily Feel Good Quote Contest</h1>
            <p className="tac">
              Every day we showcase a feel good quote. The winner from this
              contest will be show cased in the following days 'Feel Good Quote'
            </p>
          </Container>
          <Container className="column flex-fill bg-white br8 gap16 pa16">
            <Container className="column flex-fill">
              <p>some content...</p>
              <p>some content...</p>
              <p>some content...</p>
              <p>some content...</p>
              <p>some content...</p>
              <p>some content...</p>
              <p>some content...</p>
            </Container>
            <Container
              className={
                "x-fill gap8 " +
                (isMobileOrTablet() ? "column" : "align-center")
              }
            >
              <TextArea
                className="flex-fill py8 px16 br4"
                onChange={(event) => {
                  if (calculateKarma(userBasicInfo) < 20)
                    return message.info(
                      "You need 20 karma points to interact with this :)"
                    );

                  setMyQuote(event.target.value);
                }}
                placeholder="Change someone's day :)"
                minRows={1}
                value={myQuote}
              />
              <Button
                onClick={() => {
                  const userInteractionIssues = userSignUpProgress(user);

                  if (userInteractionIssues) {
                    if (userInteractionIssues === "NSI") setStarterModal(true);
                    return;
                  }

                  saveQuote(
                    canUserCreateQuote,
                    isMounted,
                    myQuote,
                    quoteID,
                    setCanUserCreateQuote,
                    user.uid
                  );
                }}
                size="large"
                type="primary"
              >
                Submit My Quote
              </Button>
            </Container>
          </Container>
        </Container>
        <SubscribeColumn />
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

export default QuoteContestPage;
