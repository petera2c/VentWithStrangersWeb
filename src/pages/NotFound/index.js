import React from "react";

import Page from "../../components/containers/Page";

function NotFoundPage() {
  return (
    <Page
      className="column align-center bg-grey-2"
      description="Page not found."
      keywords=""
      title="Not Found"
    >
      <h1 className="mb16">Page Not Found</h1>
    </Page>
  );
}

export default NotFoundPage;
