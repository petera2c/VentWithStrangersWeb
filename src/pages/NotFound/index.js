import React from "react";
import { Link } from "react-router-dom";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import { isMobileOrTablet } from "../../util";

function NotFoundPage() {
  return (
    <Page
      className={
        "column align-center bg-grey-2 " +
        (isMobileOrTablet() ? "py16" : "py32")
      }
      description="Page not found."
      keywords=""
      title="Not Found"
    >
      <Text className="mb16" text="Page Not Found" type="h1" />
    </Page>
  );
}

export default NotFoundPage;
