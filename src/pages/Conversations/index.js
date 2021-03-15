import React, { useContext, useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useLocation } from "react-router-dom";
import db from "../../config/firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsHelping } from "@fortawesome/pro-duotone-svg-icons/faHandsHelping";
import { faWalkieTalkie } from "@fortawesome/pro-duotone-svg-icons/faWalkieTalkie";
import { UserContext } from "../../context";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Button from "../../components/views/Button";

import ConversationOption from "./conversation";
import Chat from "./chat";

import { isMobileOrTablet } from "../../util";

import { getConversations } from "./util";

import "./style.css";

function Conversations() {
  const user = useContext(UserContext);

  if (!user)
    return (
      <Page
        className="bg-grey-2 ov-auto pa32"
        description="Sometimes, all we need is an available ear. This is where you can anonymously talk to someone that wants to listen, or anonymously listen to someone that wants to be heard."
        keywords="vent, strangers, help"
        title="Chats"
      >
        <Container className="x-fill justify-center align-start wrap gap16">
          <h4>You must sign in to view your inbox!</h4>
        </Container>
      </Page>
    );

  const conversationsQuery = db
    .collection("conversations")
    .where("members", "array-contains", user.uid)
    .orderBy("last_updated", "desc")
    .limitToLast(20);

  const [conversations] = useCollectionData(conversationsQuery, {
    idField: "id"
  });

  const location = useLocation();
  const { search } = location;
  const [activeConversation, setActiveConversation] = useState(
    search ? search : ""
  );
  const [conversationNames, setConversationNames] = useState({});

  if (conversations && conversations.length !== 0 && !activeConversation)
    setActiveConversation(conversations[0].id);

  console.log(conversations);

  return (
    <Page
      className="bg-grey-2 ov-auto pa32"
      description="Sometimes, all we need is an available ear. This is where you can anonymously talk to someone that wants to listen, or anonymously listen to someone that wants to be heard."
      keywords="vent, strangers, help"
      title="Chats"
    >
      {conversations && conversations.length !== 0 && (
        <Container className="container extra-large justify-center align-start wrap gap16">
          <Container className="container small column bg-white pa8 br4">
            {conversations.map((conversation, index) => {
              return (
                <ConversationOption
                  conversation={conversation}
                  conversationName={conversationNames[conversation.id]}
                  isActive={conversation.id === activeConversation}
                  isLastItem={index === conversations.length - 1}
                  key={conversation.id}
                  setActiveConversation={setActiveConversation}
                  setConversationNames={setConversationNames}
                  userID={user.uid}
                />
              );
            })}
          </Container>
          {conversations.find(
            conversation => conversation.id === activeConversation
          ) && (
            <Chat
              conversation={conversations.find(
                conversation => conversation.id === activeConversation
              )}
              conversationName={conversationNames[activeConversation]}
              userID={user.uid}
            />
          )}
          {!conversations.find(
            conversation => conversation.id === activeConversation
          ) && <div>Can not find this conversation!</div>}
        </Container>
      )}
      {!conversations ||
        (conversations.length === 0 && (
          <Container className="x-fill full-center">
            <h4>
              No conversations found! Message someone from a post on our recent
              or trending page :)
            </h4>
          </Container>
        ))}
    </Page>
  );
}

export default Conversations;
