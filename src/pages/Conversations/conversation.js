import React, { useEffect, useState } from "react";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Button from "../../components/views/Button";

import { getConversation, readConversation } from "./util";

import { capitolizeFirstChar, isMobileOrTablet } from "../../util";

function Conversations({
  conversationID,
  index,
  isActive,
  isLastItem,
  onClick,
  setConversationName,
  userID
}) {
  const [conversation, setConversation] = useState(undefined);

  useEffect(() => {
    getConversation(
      conversationID,
      setConversation,
      setConversationName,
      userID
    );
  }, []);

  if (!conversation) return <div>loading</div>;
  const hasSeen = conversation[userID];
  if (isActive && !hasSeen)
    readConversation(conversation, conversationID, userID);

  return (
    <Container
      className={"clickable pa8 br4 " + (isActive ? "bg-grey-2" : "")}
      onClick={() => onClick(index)}
    >
      <p className={" " + (hasSeen ? "" : "primary")}>
        {capitolizeFirstChar(conversation.name)}
      </p>
    </Container>
  );
}

export default Conversations;
