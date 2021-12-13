import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AdSense from "react-adsense";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";

import { isMobileOrTablet } from "../../util";
import { getOnlineUsers } from "./util";
import { UserContext } from "../../context";

function OnlineUsers() {
  const componentIsMounted = useRef(true);
  const user = useContext(UserContext);

  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, [location]);

  return (
    <Page
      className="column bg-grey-2"
      description=""
      keywords=""
      title=""
    ></Page>
  );
}

export default OnlineUsers;
