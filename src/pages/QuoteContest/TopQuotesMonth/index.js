import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import Container from "../../../components/containers/Container";
import Page from "../../../components/containers/Page";

import {
  capitolizeFirstChar,
  getUserBasicInfo,
  useIsMounted,
} from "../../../util";
import { getQuotes } from "./util";

function QuoteWinnersPage() {
  const isMounted = useIsMounted();

  const [quotes, setQuotes] = useState([]);
  const [thisMonthYearFormatted, setThisMonthYearFormatted] = useState();

  useEffect(() => {
    if (isMounted()) setThisMonthYearFormatted(dayjs().format("MMMM YYYY"));
    getQuotes(isMounted, setQuotes);
  }, [isMounted, setQuotes]);

  return (
    <Page className="align-center gap16 pa32">
      <Container className="column bg-white br8 gap16 pa32">
        <h1 className="tac lh-1">{thisMonthYearFormatted} Feel Good Quotes</h1>
        <Container className="column">
          <h2 className="fs-22 grey-1 tac">Some of our favourites :)</h2>
        </Container>
      </Container>

      <Container className="justify-center x-fill wrap gap16">
        {quotes.map((quote, index) => (
          <QuoteDisplay key={quote.id} quote={quote} />
        ))}
      </Container>
    </Page>
  );
}

function QuoteDisplay({ quote }) {
  const isMounted = useIsMounted();
  const [userBasicInfo, setUserBasicInfo] = useState({});

  useEffect(() => {
    getUserBasicInfo((userBasicInfo) => {
      if (isMounted()) setUserBasicInfo(userBasicInfo);
    }, quote.userID);
  }, [isMounted, quote, setUserBasicInfo]);

  return (
    <Container className="column x-fill bg-white br8 gap8 pa16">
      <p className="italic primary fs-20 tac">
        "{capitolizeFirstChar(quote.value)}"
      </p>
      <Link className="button-8 fs-20 tac" to={"/profile?" + quote.userID}>
        - {capitolizeFirstChar(userBasicInfo.displayName)}
      </Link>
      <p className="tar">
        {dayjs(quote.server_timestamp).format("MMMM DD, YYYY")}
      </p>
    </Container>
  );
}

export default QuoteWinnersPage;
