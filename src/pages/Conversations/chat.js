import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import { Button } from "antd";

import Container from "../../components/containers/Container";
import Emoji from "../../components/Emoji";
import KarmaBadge from "../../components/KarmaBadge";
import MakeAvatar from "../../components/MakeAvatar";
import Message from "./message";

import {
  calculateKarma,
  capitolizeFirstChar,
  isMobileOrTablet,
} from "../../util";
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
  const [value, setValue] = useState(0); // integer state

  const checkIsUserTyping = (isTyping) => {
    if (typingTimer2) clearTimeout(typingTimer2);
    if (isTyping) {
      for (let memberID in isTyping) {
        if (memberID !== userID) {
          if (
            firebase.firestore.Timestamp.now().toMillis() - isTyping[memberID] <
            4000
          ) {
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
  let messageDivs = [];

  useEffect(() => {
    let messageListenerUnsubscribe;

    getMessages(
      conversation.id,
      messages,
      scrollToBottom,
      setCanLoadMore,
      setMessages
    );

    messageListenerUnsubscribe = messageListener(
      conversation.id,
      scrollToBottom,
      setMessages
    );
    setConversationID(conversation.id);

    return () => {
      if (messageListenerUnsubscribe) messageListenerUnsubscribe();
    };
  }, [conversation.id]);

  let conversationPartnerID;
  if (conversation.members && conversation.members.length === 2)
    conversationPartnerID = conversation.members.find((memberID) => {
      return memberID !== userID;
    });

  for (let index in messages) {
    const message = messages[index];
    messageDivs.unshift(
      <Message
        conversationID={conversation.id}
        key={index}
        message={message}
        setMessages={setMessages}
        userID={userID}
      />
    );
  }

  return (
    <Container className="column flex-fill x-fill full-center ov-hidden bg-white br4">
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
            <KarmaBadge
              karma={calculateKarma(conversationPartnerData)}
              noOnClick
            />
          </Link>
        )}
        {isMobileOrTablet() && (
          <Button onClick={() => setActiveConversation(false)}>Go Back</Button>
        )}
      </Container>
      <Container className="column x-fill flex-fill ov-hidden pt16 px16">
        {canLoadMore && (
          <button
            className="button-2 pa8 mb8 br4"
            onClick={() =>
              getMessages(
                conversation.id,
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
        {!messages ||
          ((messages && messages.length) === 0 && (
            <h4 className="tac">
              The conversation has been started but no messages have been sent!
            </h4>
          ))}

        <Container className="column flex-fill ov-auto">
          {messageDivs}
          <div ref={dummyRef} />
        </Container>
      </Container>
      <Container
        className="ease-in-out x-fill"
        style={{
          maxHeight: checkIsUserTyping(conversation.isTyping) ? "56px" : "0",
        }}
      >
        <Container className="ov-hidden full-center pa16">
          <MakeAvatar
            displayName={conversationPartnerData.displayName}
            userBasicInfo={conversationPartnerData}
          />
        </Container>
      </Container>

      <Container className="column x-fill">
        <Container
          className={
            "x-fill border-top  " +
            (isMobileOrTablet() ? "" : "align-center pr16")
          }
          style={{
            minHeight: isMobileOrTablet() ? "" : "80px",
          }}
        >
          <textarea
            autoFocus
            className={
              "send-message-textarea light-scrollbar " +
              (isMobileOrTablet() ? "" : "pa16")
            }
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
            value={messageString}
          />
          <Emoji
            handleChange={(emoji) => {
              setMessageString(messageString + emoji);
            }}
          />
          <button
            className={
              "button-2 " + (isMobileOrTablet() ? "px8 py4" : "px32 py8 br4")
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
