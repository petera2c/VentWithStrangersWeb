import React, { useContext, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsHelping } from "@fortawesome/pro-duotone-svg-icons/faHandsHelping";
import { faWalkieTalkie } from "@fortawesome/pro-duotone-svg-icons/faWalkieTalkie";
import { UserContext } from "../../context";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Button from "../../components/views/Button";

import Conversation from "./conversation";

import { isMobileOrTablet } from "../../util";

import { getConversations } from "./util";

function Conversations() {
  const user = useContext(UserContext);

  if (!user) return <div />;

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(0);
  useEffect(() => {
    getConversations(conversations, setConversations, user.uid);
  }, []);

  return (
    <Page
      className="bg-grey-2 ov-auto pa32"
      description="Sometimes, all we need is an available ear. This is where you can anonymously talk to someone that wants to listen, or anonymously listen to someone that wants to be heard."
      keywords="vent, strangers, help"
      title="Chats"
    >
      <Container className="x-fill full-center wrap gap16">
        <Container className="container small column bg-white px16 py8 br8">
          {conversations.map((conversation, index) => {
            return (
              <Conversation
                active={index === activeConversation}
                conversationID={conversation.id}
                isLastItem={index === conversations.length - 1}
                key={index}
                userID={user.uid}
              />
            );
          })}
        </Container>
        <Container className="container large bg-white pa16 br8">
          {conversations && conversations[activeConversation] && (
            <div>{conversations[activeConversation].server_timestamp}</div>
          )}
        </Container>
      </Container>
    </Page>
  );
}

export default Conversations;
