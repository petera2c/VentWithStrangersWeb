import React, { useContext, useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link, useLocation } from "react-router-dom";
import AdSense from "react-adsense";

import db from "../../config/firebase";

import { UserContext } from "../../context";

import StarterModal from "../../components/modals/Starter";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Button from "../../components/views/Button";

import ConversationOption from "./ConversationOption";
import Chat from "./chat";

import { userSignUpProgress } from "../../util";

import {
  getConversation,
  getConversations,
  mostRecentConversationListener
} from "./util";

import "./style.css";

function MobileConversations() {
  const componentIsMounted = useRef(true);
  const user = useContext(UserContext);

  const [conversations, setConversations] = useState([]);

  const location = useLocation();
  const { search } = location;
  const [activeConversation, setActiveConversation] = useState(
    search ? search.substring(1) : ""
  );
  const [conversationsBasicDatas, setConversationsBasicDatas] = useState({});
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [starterModal, setStarterModal] = useState(!user);

  let newMessageListenerUnsubscribe;

  useEffect(() => {
    if (newMessageListenerUnsubscribe) newMessageListenerUnsubscribe();

    if (user) {
      getConversations(
        conversations,
        setActiveConversation,
        newConversations => {
          newMessageListenerUnsubscribe = mostRecentConversationListener(
            newConversations,
            setConversations,
            user.uid
          );

          if (
            search &&
            !newConversations.find(
              conversation => conversation.id === activeConversation
            )
          ) {
            getConversation(
              componentIsMounted,
              activeConversation,
              setConversations,
              user.uid
            );
          }

          if (
            newConversations.length % 5 !== 0 ||
            newConversations.length === 0
          )
            setCanLoadMore(false);

          setConversations(newConversations);
        },
        user.uid
      );
    }

    return () => {
      if (newMessageListenerUnsubscribe) newMessageListenerUnsubscribe();
      componentIsMounted.current = false;
    };
  }, [user]);

  return (
    <Page
      className="bg-grey-2"
      description="Sometimes, all we need is an available ear. This is where you can anonymously talk to someone that wants to listen, or anonymously listen to someone that wants to be heard."
      keywords="vent, strangers, help"
      style={{ height: "100vh" }}
      title="Chats"
    >
      {!activeConversation && (
        <Container className="flex-fill column ov-auto bg-white pa8 mt16 mx8 br4">
          {conversations.length === 0 && (
            <Link className="" to="/online-users">
              <h1 className="button-1 grey-1 tac">
                <span className="blue">Start</span> a conversation with someone!
              </h1>
            </Link>
          )}
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
                setConversations={setConversations}
                userID={user.uid}
              />
            );
          })}
          {!userSignUpProgress(user, true) && canLoadMore && (
            <button
              className="button-2 pa8 my8 br4"
              onClick={() => {
                getConversations(
                  conversations,
                  setActiveConversation,
                  newConversations => {
                    if (
                      newConversations.length % 5 !== 0 ||
                      newConversations.length === 0
                    )
                      setCanLoadMore(false);

                    setConversations(oldConversations => [
                      ...oldConversations,
                      ...newConversations
                    ]);
                  },
                  user.uid
                );
              }}
            >
              Load More Conversations
            </button>
          )}
        </Container>
      )}
      {activeConversation && (
        <Container
          className="column ov-hidden bg-white container mobile-full"
          style={{ height: "500px" }}
        >
          {!conversations.find(
            conversation => conversation.id === activeConversation
          ) &&
            activeConversation && (
              <h1 className="x-fill tac py32">
                Can not find this conversation!
              </h1>
            )}
          {!conversations.find(
            conversation => conversation.id === activeConversation
          ) &&
            !activeConversation && (
              <h4
                className="button-1 grey-1 tac pa32"
                onClick={() => setStarterModal(true)}
              >
                Check your messages from friends on Vent With Strangers,
                <span className="blue"> get started here!</span>
              </h4>
            )}
          {conversations.find(
            conversation => conversation.id === activeConversation
          ) && (
            <Chat
              conversation={conversations.find(
                conversation => conversation.id === activeConversation
              )}
              conversationPartnerData={
                conversationsBasicDatas[activeConversation]
              }
              userID={user.uid}
            />
          )}
        </Container>
      )}
      {starterModal && (
        <StarterModal activeModal="login" setActiveModal={setStarterModal} />
      )}
    </Page>
  );
}

export default MobileConversations;
