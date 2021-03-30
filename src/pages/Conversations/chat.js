import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { useCollectionData } from "react-firebase-hooks/firestore";
import db from "../../config/firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";

import LoadMore from "../../components/LoadMore";

import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import Container from "../../components/containers/Container";

import Button from "../../components/views/Button";
import Text from "../../components/views/Text";
import Message from "./message";

import { capitolizeFirstChar, isMobileOrTablet } from "../../util";

import {
  getMessages,
  messageListener,
  sendMessage,
  setConversationIsTyping
} from "./util";
let typingTimer;

function Chat({ conversation, conversationName, userID }) {
  let messageListenerUnsubscribe;

  const dummyRef = useRef();
  const scrollToBottom = () => {
    dummyRef.current.scrollIntoView();
  };

  const [canLoadMore, setCanLoadMore] = useState(true);
  const [conversationID, setConversationID] = useState();
  const [messages, setMessages] = useState([]);
  const [messageString, setMessageString] = useState("");
  const [isUserCurrentlyTyping, setIsUserCurrentlyTyping] = useState(false);
  let messageDivs = [];

  if (conversation.id !== conversationID) {
    setMessages([]);
    getMessages(
      conversation.id,
      messages,
      scrollToBottom,
      setCanLoadMore,
      setMessages
    );

    if (messageListenerUnsubscribe) messageListenerUnsubscribe();
    messageListenerUnsubscribe = messageListener(
      conversation.id,
      scrollToBottom,
      setMessages
    );
    setConversationID(conversation.id);
  }

  let conversationPartnerID;
  if (conversation.members.length === 2)
    conversationPartnerID = conversation.members.find(memberID => {
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

  let isOtherUserTyping = false;
  if (conversation.isTyping) {
    for (let memberID in conversation.isTyping) {
      if (memberID !== userID && conversation.isTyping[memberID])
        isOtherUserTyping = true;
    }
  }

  return (
    <Container className="column x-fill full-center bg-white br4">
      <Container className="x-fill justify-between border-bottom pa16">
        {conversationPartnerID && (
          <Link to={"/activity?" + conversationPartnerID}>
            <h5 className={"button-1"}>
              {capitolizeFirstChar(conversationName)}
            </h5>
          </Link>
        )}
        {!conversationPartnerID && (
          <h5 className={"button-1"}>
            {capitolizeFirstChar(conversationName)}
          </h5>
        )}
      </Container>

      <Container className="column x-fill flex-fill ov-auto pa16">
        {canLoadMore && (
          <LoadMore
            canLoadMore={canLoadMore}
            loadMore={() => {
              getMessages(
                conversation.id,
                messages,
                scrollToBottom,
                setCanLoadMore,
                setMessages,
                false
              );
            }}
          />
        )}
        {messageDivs}

        <div ref={dummyRef} />
      </Container>
      {isOtherUserTyping && (
        <Container className="x-fill">
          <p className="pa16">{conversationName} is typing...</p>
        </Container>
      )}

      <Container className="column x-fill">
        <Container
          className={
            "x-fill border-top  " +
            (isMobileOrTablet() ? "" : "align-center pr16")
          }
          style={{
            minHeight: isMobileOrTablet() ? "" : "80px"
          }}
        >
          <textarea
            className={
              "send-message-textarea light-scrollbar " +
              (isMobileOrTablet() ? "" : "pa16")
            }
            onChange={event => {
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
            onKeyDown={e => {
              if (e.key === "Enter") {
                if (!messageString) return;
                sendMessage(conversation.id, messageString, userID);
                setMessageString("");
              }
            }}
            placeholder="Type a helpful message here..."
            value={messageString}
          />
          <Button
            className={
              "button-2 " + (isMobileOrTablet() ? "px8 py4" : "px32 py8 br4")
            }
            onClick={() => {
              if (!messageString) return;
              sendMessage(conversation.id, messageString, userID);
              setMessageString("");
            }}
            text="Send"
          />
        </Container>
      </Container>
    </Container>
  );
}

export default Chat;
