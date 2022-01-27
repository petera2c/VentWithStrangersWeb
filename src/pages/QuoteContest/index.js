import React, { useContext, useState } from "react";
import TextArea from "react-textarea-autosize";

import { Button, message } from "antd";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import { calculateKarma, isMobileOrTablet } from "../../util";

function QuoteContestPage() {
  const { user, userBasicInfo } = useContext(UserContext);

  const [myQuote, setMyQuote] = useState("");

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
              <Button size="large" type="primary">
                Submit My Quote
              </Button>
            </Container>
          </Container>
        </Container>
        <SubscribeColumn />
      </Container>
    </Page>
  );
}

export default QuoteContestPage;
