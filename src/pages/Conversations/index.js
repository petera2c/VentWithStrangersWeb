import React, { useContext, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsHelping } from "@fortawesome/pro-duotone-svg-icons/faHandsHelping";
import { faWalkieTalkie } from "@fortawesome/pro-duotone-svg-icons/faWalkieTalkie";
import { UserContext } from "../../context";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Button from "../../components/views/Button";

import ConversationOption from "./conversation";
import Conversation from "./chat";

import { isMobileOrTablet } from "../../util";

import { getConversations } from "./util";

import "./style.css";

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
      <Container className="x-fill justify-center align-start wrap gap16">
        <Container className="container small column bg-white pa8 br4">
          {conversations.map((conversation, index) => {
            return (
              <ConversationOption
                conversationID={conversation.id}
                index={index}
                isActive={index === activeConversation}
                isLastItem={index === conversations.length - 1}
                key={index}
                onClick={setActiveConversation}
                setConversationName={name => {
                  setConversations(conversations => {
                    conversations[index].name = name;
                    return [...conversations];
                  });
                }}
                userID={user.uid}
              />
            );
          })}
        </Container>
        {conversations && conversations[activeConversation] && (
          <Conversation
            conversation={conversations[activeConversation]}
            userID={user.uid}
          />
        )}
      </Container>
    </Page>
  );
}

export default Conversations;
