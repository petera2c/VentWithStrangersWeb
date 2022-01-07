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

import { isMobileOrTablet, userSignUpProgress } from "../../util";

import {
  getConversation,
  getConversations,
  mostRecentConversationListener
} from "./util";

import "./style.css";

function Conversations() {
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

  if (conversations && conversations.length !== 0 && !activeConversation)
    setActiveConversation(conversations[0].id);

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
      className={"bg-grey-2 " + (isMobileOrTablet() ? "" : "ov-hidden")}
      description="Sometimes, all we need is an available ear. This is where you can anonymously talk to someone that wants to listen, or anonymously listen to someone that wants to be heard."
      keywords="vent, strangers, help"
      style={{ height: "100vh" }}
      title="Chats"
    >
      <Container
        className={
          "flex-fill x-fill gap4 pa4 " +
          (isMobileOrTablet() ? "column align-center py32" : "ov-hidden")
        }
      >
        <Container
          className="container small column ov-auto bg-white pa8 br4"
          style={{ height: isMobileOrTablet() ? "200px" : "default" }}
        >
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

        <Container
          className={
            "column ov-hidden bg-white " +
            (isMobileOrTablet() ? "container mobile-full" : "flex-fill")
          }
          style={{ height: isMobileOrTablet() ? "500px" : "default" }}
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

        {!isMobileOrTablet() && (
          <Container className="container small column ov-auto bg-white pa8 br4">
            {process.env.NODE_ENV === "production" && (
              <Container className="full-center mb8">
                <AdSense.Google
                  className="adsbygoogle"
                  client="ca-pub-5185907024931065"
                  format=""
                  responsive="true"
                  slot="7871419499"
                  style={{
                    display: "block",
                    minWidth: "100px",
                    width: "100%",
                    maxWidth: "300px",
                    minHeight: "100px",
                    height: "240px",
                    maxHeight: "800px"
                  }}
                />
              </Container>
            )}
            {process.env.NODE_ENV === "production" && (
              <Container className="full-center">
                <AdSense.Google
                  className="adsbygoogle"
                  client="ca-pub-5185907024931065"
                  format=""
                  responsive="true"
                  slot="1120703532"
                  style={{
                    display: "block",
                    minWidth: "100px",
                    width: "100%",
                    maxWidth: "300px",
                    minHeight: "100px",
                    height: "240px",
                    maxHeight: "800px"
                  }}
                />
              </Container>
            )}
          </Container>
        )}
      </Container>
      {starterModal && (
        <StarterModal activeModal="login" setActiveModal={setStarterModal} />
      )}
    </Page>
  );
}

export default Conversations;
