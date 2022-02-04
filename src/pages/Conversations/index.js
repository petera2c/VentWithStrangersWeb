import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Chat from "./chat";
import Container from "../../components/containers/Container";
import ConversationOption from "./ConversationOption";
import MobileIndex from "./MobileIndex";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";

import { UserContext } from "../../context";

import {
  getIsMobileOrTablet,
  useIsMounted,
  userSignUpProgress,
} from "../../util";
import { getConversations, mostRecentConversationListener } from "./util";

function Conversations() {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);

  const location = useLocation();
  const { search } = location;

  const [activeConversation, setActiveConversation] = useState(
    search ? search.substring(1) : ""
  );
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [conversationsBasicDatas, setConversationsBasicDatas] = useState({});
  const [starterModal, setStarterModal] = useState(!user);

  useEffect(() => {
    let newMessageListenerUnsubscribe;

    if (user) {
      setStarterModal(false);
      newMessageListenerUnsubscribe = mostRecentConversationListener(
        isMounted,
        setConversations,
        user.uid
      );

      getConversations(
        activeConversation,
        [],
        isMounted,
        setActiveConversation,
        (newConversations) => {
          if (!isMounted()) return;

          if (newConversations.length < 5) setCanLoadMore(false);

          setConversations(newConversations);

          if (
            !activeConversation &&
            newConversations &&
            newConversations.length !== 0 &&
            newConversations[0].id
          )
            setActiveConversation(newConversations[0].id);
        },
        user.uid
      );
    }

    return () => {
      if (newMessageListenerUnsubscribe) newMessageListenerUnsubscribe();
    };
  }, [activeConversation, isMounted, user]);

  return (
    <Page className="bg-grey-2 ov-hidden">
      <Container className="flex-fill x-fill gap4 ov-hidden pa4">
        <Container className="container small column ov-auto bg-white pa8 br4">
          {conversations.length === 0 && (
            <Link className="" to="/people-online">
              <h6 className="button-1 grey-1 tac">
                Start a conversation with someone!
              </h6>
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
                  activeConversation,
                  conversations,
                  isMounted,
                  setActiveConversation,
                  (newConversations, subtraction) => {
                    if (
                      newConversations.length < 5 - subtraction ||
                      newConversations.length === 0
                    )
                      setCanLoadMore(false);

                    setConversations((oldConversations) => [
                      ...oldConversations,
                      ...newConversations,
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

        <Container className="column flex-fill ov-hidden bg-white br4">
          {!conversations.find(
            (conversation) => conversation.id === activeConversation
          ) &&
            activeConversation && (
              <h1 className="x-fill tac py32">
                Can not find this conversation!
              </h1>
            )}
          {!activeConversation && user && user.emailVerified && (
            <Link className="grey-1 tac pa32" to="/people-online">
              <h4 className="tac">
                Check your messages from friends on Vent With Strangers,{" "}
              </h4>
              <h1 className="blue">See Who is Online :)</h1>
            </Link>
          )}
          {(!user || (user && !user.emailVerified)) && (
            <h4
              className="button-1 grey-1 tac pa32"
              onClick={() => {
                if (!user) setStarterModal(true);
                else {
                  userSignUpProgress(user);
                }
              }}
            >
              Check your messages from friends on Vent With Strangers,
              <span className="blue">
                {user ? " verify your email!" : " get started here!"}
              </span>
            </h4>
          )}
          {conversations.find(
            (conversation) => conversation.id === activeConversation
          ) && (
            <Chat
              conversation={conversations.find(
                (conversation) => conversation.id === activeConversation
              )}
              conversationPartnerData={
                conversationsBasicDatas[activeConversation]
              }
              userID={user.uid}
            />
          )}
        </Container>
      </Container>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Page>
  );
}

let temp;

if (getIsMobileOrTablet()) temp = Conversations;
else temp = MobileIndex;

export default temp;
