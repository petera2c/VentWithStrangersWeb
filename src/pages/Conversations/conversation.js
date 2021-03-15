import React, { useEffect, useState } from "react";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Button from "../../components/views/Button";

import { getConversationName, readConversation } from "./util";

import { capitolizeFirstChar, isMobileOrTablet } from "../../util";

function Conversations({
  conversation,
  conversationName,
  isActive,
  isLastItem,
  setActiveConversation,
  setConversationNames,
  userID
}) {
  useEffect(() => {
    getConversationName(conversation, setConversationNames, userID);
  }, []);

  if (!conversation) return <div>loading</div>;
  const hasSeen = conversation[userID];
  if (isActive && !hasSeen) readConversation(conversation, userID);

  return (
    <Container
      className={"clickable pa8 br4 " + (isActive ? "bg-grey-2" : "")}
      onClick={() => setActiveConversation(conversation.id)}
    >
      <p className={" " + (hasSeen ? "" : "primary")}>
        {capitolizeFirstChar(conversationName)}
      </p>
    </Container>
  );
}

export default Conversations;
