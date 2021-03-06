import React, { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import axios from "axios";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import db from "../../config/firebase";
import Consumer, { ExtraContext } from "../../context";

import LoadMore from "../../components/LoadMore";

import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import Container from "../../components/containers/Container";

import Button from "../../components/views/Button";
import Text from "../../components/views/Text";

import { capitolizeFirstChar, isMobileOrTablet } from "../../util";

import { getMessages, messageListener, sendMessage } from "./util";
let messageListenerUnsubscribe;

function Chat({ conversation, userID }) {
  const dummyRef = useRef();
  const scrollToBottom = () => {
    dummyRef.current.scrollIntoView();
  };

  const [canLoadMore, setCanLoadMore] = useState(true);
  const [conversationID, setConversationID] = useState();
  const [messages, setMessages] = useState();
  const [messageString, setMessageString] = useState("");
  let messageDivs = [];

  if (conversation.id !== conversationID) {
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

  for (let index in messages) {
    const message = messages[index];
    messageDivs.unshift(
      <Container
        className={
          "x-fill " + (message.userID === userID ? "wrap" : "justify-end")
        }
        key={index}
      >
        <Container
          className={
            "message-container px16 py8 mb8 br4 " +
            (message.userID === userID ? "bg-blue white" : "grey-1 bg-grey-10")
          }
        >
          {message.body}
        </Container>
      </Container>
    );
  }

  return (
    <Container
      className={
        "column full-center flex-fill ov-auto bg-white br4 " +
        (isMobileOrTablet()
          ? "container mobile-full"
          : "container large border-all2")
      }
      style={{ height: "80vh" }}
    >
      <Container className="x-fill justify-between border-bottom pa16">
        <Text
          className="fw-400"
          text={capitolizeFirstChar(conversation.name)}
          type="h5"
        />
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
            onChange={event => setMessageString(event.target.value)}
            placeholder="Type a helpful message here..."
            value={messageString}
          />
          <Button
            className={
              "button-2 " + (isMobileOrTablet() ? "px8 py4" : "px32 py8 br4")
            }
            onClick={() => {
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
