import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

import Page from "../../../components/containers/Page";

function NotFoundPage() {
  return (
    <Page
      className="align-center bg-blue-2 gap32 pt64"
      description="Page not found."
      keywords=""
      title="Not Found"
    >
      <h1 className="tac lh-1">Page Not Found :(</h1>
      <Link to="/">
        <Button size="large" type="primary">
          Go Home
        </Button>
      </Link>
    </Page>
  );
}

export default NotFoundPage;
