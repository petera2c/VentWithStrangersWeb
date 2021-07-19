import React, { useContext, useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useLocation } from "react-router-dom";
import db from "../../config/firebase";

import { UserContext } from "../../context";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Button from "../../components/views/Button";

import ConversationOption from "./ConversationOption";
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
    search ? search.substring(1) : ""
  );
  const [conversationsBasicDatas, setConversationsBasicDatas] = useState({});

  if (conversations && conversations.length !== 0 && !activeConversation)
    setActiveConversation(conversations[0].id);

  return (
    <Page
      className={"bg-grey-2 pa4 " + (isMobileOrTablet() ? "" : "ov-hidden")}
      description="Sometimes, all we need is an available ear. This is where you can anonymously talk to someone that wants to listen, or anonymously listen to someone that wants to be heard."
      keywords="vent, strangers, help"
      title="Chats"
    >
      {conversations && conversations.length !== 0 && (
        <Container
          className={
            "flex-fill x-fill gap4 " +
            (isMobileOrTablet() ? "column align-center py32" : "ov-hidden")
          }
        >
          <Container
            className="container small column ov-auto bg-white pa8 br4"
            style={{ height: isMobileOrTablet() ? "200px" : "default" }}
          >
            {conversations.map((conversation, index) => {
              return (
                <ConversationOption
                  conversation={conversation}
                  conversationPartnerData={
                    conversationsBasicDatas[conversation.id]
                  }
                  isActive={conversation.id === activeConversation}
                  isLastItem={index === conversations.length - 1}
                  key={conversation.id}
                  setActiveConversation={setActiveConversation}
                  setConversationsBasicDatas={setConversationsBasicDatas}
                  userID={user.uid}
                />
              );
            })}
          </Container>
          {conversations.find(
            conversation => conversation.id === activeConversation
          ) && (
            <Container
              className={
                "ov-hidden " +
                (isMobileOrTablet() ? "container mobile-full" : "flex-fill")
              }
              style={{ height: isMobileOrTablet() ? "500px" : "default" }}
            >
              <Chat
                conversation={conversations.find(
                  conversation => conversation.id === activeConversation
                )}
                conversationPartnerData={
                  conversationsBasicDatas[activeConversation]
                }
                userID={user.uid}
              />
            </Container>
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

/*


*/

export default Conversations;
