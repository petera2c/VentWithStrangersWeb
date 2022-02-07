import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { off } from "firebase/database";
import loadable from "@loadable/component";
import { Button } from "antd";

import Container from "../../components/containers/Container";
import KarmaBadge from "../../components/views/KarmaBadge";
import Message from "./message";

import {
  capitolizeFirstChar,
  getIsMobileOrTablet,
  useIsMounted,
} from "../../util";
import {
  getConversationPartnerUserID,
  getMessages,
  isUserTypingListener,
  messageListener,
  sendMessage,
  setConversationIsTyping,
} from "./util";

const Emoji = loadable(() => import("../../components/Emoji"));
const MakeAvatar = loadable(() => import("../../components/views/MakeAvatar"));

let typingTimer;

function Chat({
  activeConversationID,
  conversationPartnerData = {},
  setActiveConversationID,
  userID,
}) {
  const isMounted = useIsMounted();

  const dummyRef = useRef();
  const textInput = useRef(null);
  const isUserTypingTimeout = useRef();

  const [conversation, setConversation] = useState();

  const scrollToBottom = () => {
    if (dummyRef.current)
      dummyRef.current.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "smooth",
        alignToTop: false,
      });
  };

  const [allowToSetIsUserTypingToDB, setAllowToSetIsUserTypingToDB] = useState(
    true
  );
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState();
  const [messages, setMessages] = useState([]);
  const [messageString, setMessageString] = useState("");
  const [showPartnerIsTyping, setShowPartnerIsTyping] = useState(false);

  useEffect(() => {
    let messageListenerUnsubscribe;
    let isUserTypingUnsubscribe;

    setIsMobileOrTablet(getIsMobileOrTablet());
    setCanLoadMore(true);

    if (
      conversation &&
      conversation.members &&
      conversation.members.length <= 2
    ) {
      isUserTypingUnsubscribe = isUserTypingListener(
        activeConversationID,
        isMounted,
        isUserTypingTimeout,
        getConversationPartnerUserID(conversation.members, userID),
        scrollToBottom,
        setShowPartnerIsTyping
      );
    }

    getMessages(
      activeConversationID,
      isMounted,
      [],
      scrollToBottom,
      setCanLoadMore,
      setMessages
    );

    messageListenerUnsubscribe = messageListener(
      activeConversationID,
      isMounted,
      scrollToBottom,
      setMessages
    );

    return () => {
      if (isUserTypingUnsubscribe) off(isUserTypingUnsubscribe);

      if (messageListenerUnsubscribe) messageListenerUnsubscribe();
    };
  }, [activeConversationID, isMounted, userID]);

  let conversationPartnerID;
  if (conversation && conversation.members && conversation.members.length === 2)
    conversationPartnerID = conversation.members.find((memberID) => {
      return memberID !== userID;
    });

  return (
    <Container className="column flex-fill x-fill full-center ov-hidden br4">
      <Container className="justify-between x-fill border-bottom pa16">
        {conversationPartnerID && (
          <Link className="flex" to={"/profile?" + conversationPartnerID}>
            <Container className="full-center">
              <h5 className="button-1 mr8">
                {capitolizeFirstChar(conversationPartnerData.displayName)}
              </h5>
            </Container>
            {!conversationPartnerID && (
              <h5 className="button-1 mr8">
                {capitolizeFirstChar(conversationPartnerData.displayName)}
              </h5>
            )}
            <KarmaBadge noOnClick userBasicInfo={conversationPartnerData} />
          </Link>
        )}
        {isMobileOrTablet && (
          <Button onClick={() => setActiveConversationID(false)}>
            Go Back
          </Button>
        )}
      </Container>

      <Container className="column x-fill flex-fill ov-hidden px16">
        {!messages ||
          ((messages && messages.length) === 0 && (
            <h4 className="tac">
              The conversation has been started but no messages have been sent!
            </h4>
          ))}

        <Container
          className={"column flex-fill ov-auto " + (canLoadMore ? "" : "pt8")}
        >
          {canLoadMore && (
            <button
              className="button-2 pa8 mb8 br4"
              onClick={() =>
                getMessages(
                  activeConversationID,
                  isMounted,
                  messages,
                  scrollToBottom,
                  setCanLoadMore,
                  setMessages,
                  false
                )
              }
            >
              Load More Messages
            </button>
          )}
          {messages.map((message, index) => (
            <Message
              conversationID={activeConversationID}
              key={index}
              message={message}
              setMessages={setMessages}
              userID={userID}
            />
          ))}
          <div ref={dummyRef} />
        </Container>
      </Container>
      <Container
        className="ease-in-out x-fill"
        style={{
          maxHeight: showPartnerIsTyping ? "56px" : "0",
        }}
      >
        <Container className="bg-none ov-hidden full-center">
          <Container className="align-end pl16">
            <MakeAvatar
              displayName={conversationPartnerData.displayName}
              userBasicInfo={conversationPartnerData}
            />
            <h4>...</h4>
          </Container>
        </Container>
      </Container>

      <Container className="column x-fill">
        <Container
          className={
            "x-fill border-top  " +
            (isMobileOrTablet ? "" : "align-center pr16")
          }
        >
          <textarea
            autoFocus
            className="send-message-textarea light-scrollbar"
            onChange={(event) => {
              if (event.target.value === "\n") return;
              setMessageString(event.target.value);

              if (!allowToSetIsUserTypingToDB) {
                if (!typingTimer) {
                  typingTimer = setTimeout(() => {
                    setAllowToSetIsUserTypingToDB(true);

                    if (typingTimer) typingTimer = undefined;
                  }, 500);
                }
              } else {
                setConversationIsTyping(
                  activeConversationID,
                  undefined,
                  userID
                );
                setAllowToSetIsUserTypingToDB(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!messageString) return;
                setConversationIsTyping(activeConversationID, true, userID);
                setAllowToSetIsUserTypingToDB(true);
                sendMessage(activeConversationID, messageString, userID);
                setMessageString("");
              }
            }}
            placeholder="Type a helpful message here..."
            ref={textInput}
            value={messageString}
            rows={1}
          />
          <Emoji
            handleChange={(emoji) => {
              setMessageString(messageString + emoji);
              textInput.current.focus();
            }}
            top
          />
          <button
            className={
              "button-2 " + (isMobileOrTablet ? "px8 py4" : "px32 py8 br4")
            }
            onClick={() => {
              if (!messageString) return;
              setConversationIsTyping(activeConversationID, true, userID);
              setAllowToSetIsUserTypingToDB(true);
              sendMessage(conversation.id, messageString, userID);
              setMessageString("");
            }}
          >
            Send
          </button>
        </Container>
      </Container>
    </Container>
  );
}

export default Chat;
