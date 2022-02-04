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
    <Page className="gap32 py32 px8">
      <Container className="column gap16">
        <h1 className="tac lh-1">{thisMonthYearFormatted} Feel Good Quotes</h1>
        <Container className="column gap8">
          <h2 className="fs-22 grey-11 tac lh-1">
            Some of our past contest winners :)
          </h2>
          <h2 className="fs-18 grey-11 tac lh-1">
            (All feel good quotes are original!)
          </h2>
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
  const [width, setWidth] = useState(200);
  useEffect(() => {
    getUserBasicInfo((userBasicInfo) => {
      if (isMounted()) setUserBasicInfo(userBasicInfo);
    }, quote.userID);

    let width = quote.value.length * 6;

    if (width < 100) width = 100;
    if (width > 800) width = 800;

    if (isMounted()) setWidth(width);
  }, [isMounted, quote, setUserBasicInfo]);

  return (
    <Container
      className="column bg-white shadow-2 br8 gap8 pa16"
      style={{ width: width + "px" }}
    >
      <p className="italic primary fs-20 tac">
        {capitolizeFirstChar(quote.value)}
      </p>
      <Link className="button-8 fs-20 tac" to={"/profile?" + quote.userID}>
        - {capitolizeFirstChar(userBasicInfo.displayName)}
      </Link>
      <p className="tar">
        {dayjs(quote.server_timestamp).format("MMMM DD YYYY")}
      </p>
    </Container>
  );
}

export default QuoteWinnersPage;
