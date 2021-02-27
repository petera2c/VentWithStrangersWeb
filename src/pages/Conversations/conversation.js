import React, { useEffect, useState } from "react";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Button from "../../components/views/Button";

import { getConversation } from "./util";

import { isMobileOrTablet } from "../../util";

function Conversations({ conversationID, isLastItem, userID }) {
  const [conversation, setConversation] = useState(undefined);

  useEffect(() => {
    getConversation(conversationID, setConversation, userID);
  }, []);

  if (!conversation) return <div>loading</div>;

  return (
    <Container className={"py8 " + (isLastItem ? "" : "border-bottom")}>
      {conversation.server_timestamp}
    </Container>
  );
}

export default Conversations;
