import React, { useContext, useEffect, useState } from "react";
import TextArea from "react-textarea-autosize";
import { Button, Dropdown, message } from "antd";

import { faHeart } from "@fortawesome/pro-regular-svg-icons/faHeart";
import { faHeart as faHeart2 } from "@fortawesome/pro-solid-svg-icons/faHeart";
import { faQuoteLeft } from "@fortawesome/pro-duotone-svg-icons/faQuoteLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../components/containers/Container";
import Options from "../../components/Options";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import {
  calculateKarma,
  capitolizeFirstChar,
  getUserBasicInfo,
  hasUserBlockedUser,
  isMobileOrTablet,
  useIsMounted,
  userSignUpProgress,
} from "../../util";
import {
  getCanUserCreateQuote,
  getHasUserLikedQuote,
  getQuotes,
  saveQuote,
} from "./util";

function QuoteContestPage() {
  const isMounted = useIsMounted();
  const { user, userBasicInfo } = useContext(UserContext);

  const [canUserCreateQuote, setCanUserCreateQuote] = useState(true);
  const [myQuote, setMyQuote] = useState("");
  const [quoteID, setQuoteID] = useState();
  const [quotes, setQuotes] = useState([]);
  const [starterModal, setStarterModal] = useState();

  useEffect(() => {
    if (user) getCanUserCreateQuote(isMounted, setCanUserCreateQuote, user.uid);
    getQuotes(undefined, setQuotes);
  }, []);

  return (
    <Page className="pa16">
      <Container className="gap8">
        <Container className="column flex-fill">
          <Container className="column gap8 pa16">
            <h1 className="tac">Daily Feel Good Quote Contest</h1>
            <p className="tac">
              Every day we display a feel good quote. The winner from this
              contest will be show cased for the following day
            </p>
          </Container>
          <Container className="column flex-fill bg-white br8 gap16 pa16">
            <Container className="column flex-fill gap8 pa16">
              {quotes.map((quote, index) => {
                return (
                  <Quote
                    key={index}
                    isLast={index === quotes.length - 1}
                    quote={quote}
                    user={user}
                  />
                );
              })}
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

function Quote({ isLast, quote, user }) {
  const isMounted = useIsMounted();

  const [author, setAuthor] = useState({});
  const [hasLiked, setHasLiked] = useState();
  const [isContentBlocked, setIsContentBlocked] = useState();

  useEffect(() => {
    getUserBasicInfo((author) => {
      if (isMounted()) setAuthor(author);
    }, quote.userID);

    if (user) {
      hasUserBlockedUser(user.uid, quote.userID, setIsContentBlocked);
      getHasUserLikedQuote(
        quote.id,
        (hasLiked) => {
          if (isMounted()) setHasLiked(hasLiked);
        },
        user.uid
      );
    }
  }, []);

  if (isContentBlocked) return <div />;

  return (
    <Container className={"gap16 py8 " + (isLast ? "" : "border-bottom")}>
      <FontAwesomeIcon className="blue" icon={faQuoteLeft} size="3x" />
      <Container className="column flex-fill align-end justify-center gap8">
        <p className="x-fill italic">{quote.value}</p>
        <p>- {capitolizeFirstChar(author.displayName)}</p>
      </Container>
      <Container className="column justify-between">
        {user && (
          <Options
            deleteFunction={() => {}}
            editFunction={() => {}}
            objectID={quote.id}
            objectUserID={quote.userID}
            reportFunction={() => {}}
            userID={user.uid}
          />
        )}
        <FontAwesomeIcon
          className={`heart ${hasLiked ? "red" : "grey-5"}`}
          icon={hasLiked ? faHeart2 : faHeart}
        />
      </Container>
    </Container>
  );
}

export default QuoteContestPage;
