import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

import Page from "../components/containers/Page";

function CoFounderPage() {
  return (
    <Page
      className="align-center bg-blue-2 gap32 pt64"
      description="Page not found."
      keywords=""
      title="Not Found"
    >
      <h1 className="tac lh-1">Co founder Peter Young</h1>
      <a href="https://angel.co/u/peter-young2">View my angel list profile</a>
    </Page>
  );
}

export default CoFounderPage;
