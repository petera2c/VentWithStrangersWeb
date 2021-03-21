import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { useLocation, useHistory } from "react-router-dom";

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
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    getConversationName(conversation, setConversationNames, userID);
  }, []);

  if (!conversation) return <div>loading</div>;
  const hasSeen = conversation[userID];
  if (isActive && !hasSeen) readConversation(conversation, userID);

  return (
    <Container
      className={"column clickable pa8 br4 " + (isActive ? "bg-grey-2" : "")}
      onClick={() => {
        setActiveConversation(conversation.id);
        history.push("/conversations?" + conversation.id);
      }}
    >
      <h6 className={" " + (hasSeen ? "" : "primary")}>
        {capitolizeFirstChar(conversationName)}
      </h6>
      {conversation.last_message && (
        <p>
          {conversation.last_message.length > 40
            ? conversation.last_message.substring(0, 40) + "..."
            : conversation.last_message}{" "}
          ·{" "}
          {moment(conversation.last_updated)
            .subtract(1, "minute")
            .fromNow()}
        </p>
      )}
    </Container>
  );
}

export default Conversations;
