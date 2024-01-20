import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TextArea from "react-textarea-autosize";
import dayjs from "dayjs";
import { Button, message } from "antd";

import { faChevronCircleUp } from "@fortawesome/pro-solid-svg-icons/faChevronCircleUp";
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
  countdown,
  formatSeconds,
  getIsMobileOrTablet,
  getUserBasicInfo,
  hasUserBlockedUser,
  useIsMounted,
  userSignUpProgress,
} from "../../util";
import {
  deleteQuote,
  getCanUserCreateQuote,
  getHasUserLikedQuote,
  getQuotes,
  likeOrUnlikeQuote,
  reportQuote,
  saveQuote,
} from "./util";

function QuoteContestPage() {
  const isMounted = useIsMounted();
  const { user, userBasicInfo } = useContext(UserContext);

  const [canLoadMoreQuotes, setCanLoadMoreQuotes] = useState(true);
  const [canUserCreateQuote, setCanUserCreateQuote] = useState(true);
  const [contestTimeLeft, setContestTimeLeft] = useState();
  const [isMobileOrTablet, setIsMobileOrTablet] = useState();
  const [myQuote, setMyQuote] = useState("");
  const [quoteID, setQuoteID] = useState();
  const [quotes, setQuotes] = useState([]);
  const [starterModal, setStarterModal] = useState();

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());

    if (user) getCanUserCreateQuote(isMounted, setCanUserCreateQuote, user.uid);
    getQuotes(isMounted, undefined, setCanLoadMoreQuotes, setQuotes);
    let timeLeftDayjs = new dayjs().utcOffset(0).add(1, "day");
    timeLeftDayjs = timeLeftDayjs.set("hour", 0);
    timeLeftDayjs = timeLeftDayjs.set("minute", 0);
    timeLeftDayjs = timeLeftDayjs.set("hour", 0);
    timeLeftDayjs = timeLeftDayjs.set("hour", 0);

    countdown(isMounted, timeLeftDayjs, setContestTimeLeft);
    let interval = setInterval(
      () => countdown(isMounted, timeLeftDayjs, setContestTimeLeft),
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [isMounted, user]);

  return (
    <Page className="pa16">
      <Container className="gap8" style={{ height: "100%" }}>
        <Container className="column flex-fill">
          <Container className="column flex-fill ov-hidden bg-white br8">
            <Container className="column flex-fill ov-auto gap8 pt8 px16">
              <Container className="column border-bottom gap8 px16 pb16">
                <h1 className="tac">Feel Good Quote Contest</h1>
                <Container className="column gap4">
                  <p className="tac">
                    Every day we display a feel good quote. The winner from this
                    contest will be show cased for the following day
                  </p>
                  <p className="tac lh-1">
                    Time left in contest: {formatSeconds(contestTimeLeft)}
                  </p>
                </Container>
              </Container>
              {quotes.map((quote, index) => {
                return (
                  <Quote
                    isLast={index === quotes.length - 1}
                    key={quote.id}
                    quote1={quote}
                    setCanUserCreateQuote={setCanUserCreateQuote}
                    setMyQuote={setMyQuote}
                    setQuoteID={setQuoteID}
                    setQuotes={setQuotes}
                    setStarterModal={setStarterModal}
                    user={user}
                  />
                );
              })}
              {canLoadMoreQuotes && (
                <Button
                  onClick={() =>
                    getQuotes(
                      isMounted,
                      quotes,
                      setCanLoadMoreQuotes,
                      setQuotes
                    )
                  }
                  type="primary"
                >
                  Load More Quotes
                </Button>
              )}
            </Container>

            <Container
              className={
                "x-fill shadow-2 gap8 pa16 " +
                (isMobileOrTablet ? "column" : "align-center")
              }
            >
              <TextArea
                className="flex-fill py8 px16 br4"
                onChange={(event) => {
                  const userInteractionIssues = userSignUpProgress(user);

                  if (userInteractionIssues) {
                    if (userInteractionIssues === "NSI")
                      return setStarterModal(true);
                  }
                  if (userInteractionIssues) return;

                  if (calculateKarma(userBasicInfo) < 20)
                    return message.info(
                      "You need 20 karma points to interact with this :)"
                    );

                  if (!event.target.value && quoteID) setQuoteID(null);
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
                    if (userInteractionIssues === "NSI")
                      return setStarterModal(true);
                  }

                  if (myQuote)
                    saveQuote(
                      canUserCreateQuote,
                      isMounted,
                      myQuote,
                      quoteID,
                      setCanUserCreateQuote,
                      setMyQuote,
                      setQuotes,
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
        <SubscribeColumn slot="1425588771" />
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

function Quote({
  isLast,
  quote1,
  setCanUserCreateQuote,
  setMyQuote,
  setQuoteID,
  setQuotes,
  setStarterModal,
  user,
}) {
  const isMounted = useIsMounted();

  const [author, setAuthor] = useState({});
  const [hasLiked, setHasLiked] = useState();
  const [isContentBlocked, setIsContentBlocked] = useState();
  const [quote, setQuote] = useState(quote1);

  useEffect(() => {
    getUserBasicInfo((author) => {
      if (isMounted()) setAuthor(author);
    }, quote.userID);

    if (user) {
      hasUserBlockedUser(
        isMounted,
        user.uid,
        quote.userID,
        setIsContentBlocked
      );
      getHasUserLikedQuote(
        quote.id,
        (hasLiked) => {
          if (isMounted()) setHasLiked(hasLiked);
        },
        user.uid
      );
    }
  }, [isMounted, quote.id, quote.userID, user]);

  if (isContentBlocked) return <div />;

  return (
    <Container className={"py8 " + (isLast ? "" : "border-bottom")}>
      <Container className="flex-fill align-center gap16">
        <FontAwesomeIcon className="blue" icon={faQuoteLeft} size="3x" />
        <Container className="column flex-fill align-center gap8">
          <p className="italic tac">{quote.value}</p>
          <Link to={"/profile?" + quote.userID}>
            <p className="blue tac">
              - {capitolizeFirstChar(author.displayName)}
            </p>
          </Link>
        </Container>
      </Container>
      <Container className="gap8">
        <Container className="align-end">
          <h4 className="grey-5" style={{ lineHeight: 1.1 }}>
            {quote.like_counter ? quote.like_counter : 0}
          </h4>
        </Container>

        <Container
          className={
            "column align-center gap4 " +
            (user ? "justify-between " : "justify-end")
          }
        >
          {user && (
            <Options
              canUserInteractFunction={
                userSignUpProgress(user, true)
                  ? () => {
                      const userInteractionIssues = userSignUpProgress(user);

                      if (userInteractionIssues) {
                        if (userInteractionIssues === "NSI")
                          return setStarterModal(true);
                      }
                    }
                  : false
              }
              deleteFunction={(quoteID) =>
                deleteQuote(
                  quoteID,
                  setCanUserCreateQuote,
                  setQuoteID,
                  setQuotes
                )
              }
              editFunction={() => {
                setQuoteID(quote.id);
                setMyQuote(quote.value);
              }}
              objectID={quote.id}
              objectUserID={quote.userID}
              reportFunction={(option) => {
                reportQuote(option, quote.id, user.uid);
              }}
              userID={user.uid}
            />
          )}

          <FontAwesomeIcon
            className={`clickable button-8 ${hasLiked ? "blue" : "grey-5"}`}
            icon={faChevronCircleUp}
            onClick={async () => {
              const userInteractionIssues = userSignUpProgress(user);

              if (userInteractionIssues) {
                if (userInteractionIssues === "NSI") setStarterModal(true);
                return;
              }

              await likeOrUnlikeQuote(hasLiked, quote, user);

              await getHasUserLikedQuote(quote.id, setHasLiked, user.uid);

              if (!quote.like_counter) quote.like_counter = 0;
              if (hasLiked) quote.like_counter--;
              else quote.like_counter++;

              setQuote({ ...quote });
            }}
            size="2x"
          />
        </Container>
      </Container>
    </Container>
  );
}

export default QuoteContestPage;
