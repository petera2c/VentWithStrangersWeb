import React, { useEffect, useRef, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Button } from "antd";

import Container from "../../components/containers/Container";
import Emoji from "../../components/Emoji";
import KarmaBadge from "../../components/KarmaBadge";
import MakeAvatar from "../../components/MakeAvatar";
import Message from "./message";

import { capitolizeFirstChar } from "../../util";
import {
  getMessages,
  messageListener,
  sendMessage,
  setConversationIsTyping,
} from "./util";

let typingTimer;
let typingTimer2;

function Chat({
  conversation,
  conversationPartnerData = {},
  setActiveConversation,
  userID,
}) {
  const isMounted = useRef(false);
  const textInput = useRef(null);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState();
  const [value, setValue] = useState(0); // integer state

  const checkIsUserTyping = (isTyping) => {
    if (typingTimer2) clearTimeout(typingTimer2);
    if (isTyping) {
      for (let memberID in isTyping) {
        if (memberID !== userID) {
          if (Timestamp.now().toMillis() - isTyping[memberID] < 4000) {
            typingTimer2 = setTimeout(() => {
              setValue((value) => value + 1);
            }, 4000);
            return true;
          } else return false;
        }
      }
    }
  };

  const dummyRef = useRef();
  const scrollToBottom = () => {
    if (dummyRef.current)
      dummyRef.current.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "smooth",
        alignToTop: false,
      });
  };

  const [canLoadMore, setCanLoadMore] = useState(true);
  const [conversationID, setConversationID] = useState();
  const [messages, setMessages] = useState([]);
  const [messageString, setMessageString] = useState("");
  const [isUserCurrentlyTyping, setIsUserCurrentlyTyping] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    let messageListenerUnsubscribe;
    import("../../util").then((functions) => {
      setIsMobileOrTablet(functions.getIsMobileOrTablet());
    });

    setCanLoadMore(true);

    getMessages(
      conversation.id,
      isMounted,
      messages,
      scrollToBottom,
      setCanLoadMore,
      setMessages
    );

    messageListenerUnsubscribe = messageListener(
      conversation.id,
      isMounted,
      scrollToBottom,
      setMessages
    );
    if (isMounted) setConversationID(conversation.id);

    return () => {
      isMounted.current = false;

      if (messageListenerUnsubscribe) messageListenerUnsubscribe();
    };
  }, [conversation.id]);

  let conversationPartnerID;
  if (conversation.members && conversation.members.length === 2)
    conversationPartnerID = conversation.members.find((memberID) => {
      return memberID !== userID;
    });

  const isFriendTyping = checkIsUserTyping(conversation.isTyping);

  if (isFriendTyping) setTimeout(scrollToBottom, 400);

  return (
    <Container className="column flex-fill x-fill full-center ov-hidden br4">
      <Container className="justify-between x-fill border-bottom pa16">
        {conversationPartnerID && (
          <Link className="flex" to={"/profile?" + conversationPartnerID}>
            <Container className="full-center">
              <h5 className="button-1 mr8">
                {capitolizeFirstChar(conversationPartnerData.displayName)}
              </h5>
              {conversationPartnerData.isUserOnline && (
                <div className="online-dot mr8" />
              )}
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
          <Button onClick={() => setActiveConversation(false)}>Go Back</Button>
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
                  conversation.id,
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
              conversationID={conversation.id}
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
          maxHeight: isFriendTyping ? "56px" : "0",
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

              if (isUserCurrentlyTyping) {
                if (typingTimer) clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                  setIsUserCurrentlyTyping(false);
                }, 2000);
              } else {
                setIsUserCurrentlyTyping(true);
                setConversationIsTyping(conversationID, userID);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!messageString) return;
                sendMessage(conversation.id, messageString, userID);
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
