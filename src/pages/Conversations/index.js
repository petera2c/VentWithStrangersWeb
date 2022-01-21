import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import loadable from "@loadable/component";

import StarterModal from "../../components/modals/Starter";

import { UserContext } from "../../context";

import { isMobileOrTablet, useIsMounted, userSignUpProgress } from "../../util";

import { getConversations, mostRecentConversationListener } from "./util";

import "./style.css";

const Chat = loadable(() => import("./chat"));
const Container = loadable(() =>
  import("../../components/containers/Container")
);
const ConversationOption = loadable(() => import("./ConversationOption"));
const MobileIndex = loadable(() => import("./MobileIndex"));
const Page = loadable(() => import("../../components/containers/Page"));

function Conversations() {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);

  const [conversations, setConversations] = useState([]);

  const location = useLocation();
  const { search } = location;
  const [activeConversation, setActiveConversation] = useState(
    search ? search.substring(1) : ""
  );
  const [conversationsBasicDatas, setConversationsBasicDatas] = useState({});
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [starterModal, setStarterModal] = useState(!user);

  useEffect(() => {
    let newMessageListenerUnsubscribe;

    if (user) {
      newMessageListenerUnsubscribe = mostRecentConversationListener(
        isMounted,
        setConversations,
        user.uid
      );

      getConversations(
        activeConversation,
        conversations,
        isMounted,
        setActiveConversation,
        (newConversations) => {
          if (!isMounted()) return;

          if (newConversations.length < 5) setCanLoadMore(false);

          setConversations(newConversations);

          if (
            !activeConversation &&
            newConversations &&
            newConversations.length !== 0
          )
            setActiveConversation(newConversations[0].id);
        },
        user.uid
      );
    }

    return () => {
      if (newMessageListenerUnsubscribe) newMessageListenerUnsubscribe();
    };
  }, [isMounted, user]);

  return (
    <Page
      className="bg-grey-2 ov-hidden"
      description="Sometimes, all we need is an available ear. This is where you can anonymously talk to someone that wants to listen, or anonymously listen to someone that wants to be heard."
      keywords="vent, strangers, help"
      title="Chats"
    >
      <Container className="flex-fill x-fill gap4 ov-hidden pa4">
        <Container className="container small column ov-auto bg-white pa8 br4">
          {conversations.length === 0 && (
            <Link className="" to="/online-users">
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
            <Link className="grey-1 tac pa32" to="/online-users">
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

if (!isMobileOrTablet()) temp = Conversations;
else temp = MobileIndex;

export default temp;
