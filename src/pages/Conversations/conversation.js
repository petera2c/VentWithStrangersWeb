import React, { useEffect, useState } from "react";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Button from "../../components/views/Button";

import { getConversation } from "./util";

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

  return (
    <Container
      className={"clickable pa8 br4 " + (isActive ? "bg-grey-2" : "")}
      onClick={() => onClick(index)}
    >
      {capitolizeFirstChar(conversation.name)}
    </Container>
  );
}

export default Conversations;
