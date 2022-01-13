import React from "react";

import Page from "../../components/containers/Page";

function FeedbackPage() {
  return (
    <Page
      className="column align-center bg-grey-2"
      description="Help make our website better"
      keywords=""
      title="Feedback"
    >
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSeTTDQ_NOJSp5gdlesI5ggm3QXsgK8eLtoSIfOdNTr9Tczb6A/viewform?embedded=true"
        width="100%"
        height="800"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title=""
      >
        Loading…
      </iframe>
    </Page>
  );
}

export default FeedbackPage;
