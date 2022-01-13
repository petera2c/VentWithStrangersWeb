import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { useLocation, useNavigate } from "react-router-dom";

import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "../../components/views/Button";
import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import Container from "../../components/containers/Container";
import HandleOutsideClick from "../../components/containers/HandleOutsideClick";
import KarmaBadge from "../../components/KarmaBadge";
import MakeAvatar from "../../components/MakeAvatar";
import Page from "../../components/containers/Page";

import {
  blockUser,
  calculateKarma,
  capitolizeFirstChar,
  isMobileOrTablet
} from "../../util";
import {
  deleteConversation,
  getConversationBasicData,
  conversationListener,
  readConversation
} from "./util";

function ConversationOption({
  conversation,
  conversationPartnerData,
  isActive,
  isLastItem,
  setActiveConversation,
  setConversationsBasicDatas,
  setConversations,
  userID
}) {
  const navigate = useNavigate();
  const [blockModal, setBlockModal] = useState(false);
  const [conversationOptions, setConversationOptions] = useState(false);
  const [deleteConversationConfirm, setDeleteConversationConfirm] = useState(
    false
  );
  const [handleOutsideClickCalled, setHandleOutsideClickCalled] = useState(
    false
  );

  const [currentConversation, setCurrentConversation] = useState(conversation);

  useEffect(() => {
    let conversationUpdatedListenerUnsubscribe;

    getConversationBasicData(conversation, setConversationsBasicDatas, userID);
    conversationUpdatedListenerUnsubscribe = conversationListener(
      currentConversation,
      setConversations,
      setCurrentConversation
    );

    return () => {
      if (conversationUpdatedListenerUnsubscribe)
        conversationUpdatedListenerUnsubscribe();
    };
  }, []);

  if (!conversation) return <div>loading</div>;
  const hasSeen = conversation[userID];
  if (isActive && !hasSeen) readConversation(conversation, userID);

  return (
    <Container
      className={
        "relative align-center justify-between clickable pa8 br4 " +
        (isActive ? "bg-grey-2" : "")
      }
      onClick={() => {
        setActiveConversation(currentConversation.id);
        navigate.push("/conversations?" + currentConversation.id);
      }}
    >
      <Container className="flex-fill column ov-hidden">
        <Container>
          {conversationPartnerData && (
            <MakeAvatar
              displayName={conversationPartnerData.displayName}
              userBasicInfo={conversationPartnerData}
            />
          )}

          <Container className="full-center">
            <h6 className={"mr8 " + (hasSeen ? "grey-1" : "primary")}>
              {conversationPartnerData
                ? capitolizeFirstChar(conversationPartnerData.displayName)
                : "Anonymous"}
            </h6>
            {conversationPartnerData &&
              conversationPartnerData.isUserOnline && (
                <div className="online-dot mr8" />
              )}
          </Container>
          {conversationPartnerData && (
            <KarmaBadge
              karma={calculateKarma(conversationPartnerData)}
              noOnClick
            />
          )}
        </Container>
        {currentConversation.last_message && (
          <p>
            {currentConversation.last_message.length > 40
              ? currentConversation.last_message.substring(0, 40) + "..."
              : currentConversation.last_message}{" "}
            ·{" "}
            {moment(currentConversation.last_updated)
              .subtract(1, "minute")
              .fromNow()}
          </p>
        )}
      </Container>
      <FontAwesomeIcon
        className="clickable grey-9 px8"
        icon={faEllipsisV}
        onClick={e => {
          e.stopPropagation();
          if (!handleOutsideClickCalled)
            setConversationOptions(!conversationOptions);
        }}
      />

      {conversationOptions && (
        <div className="absolute top-100 pt4" style={{ zIndex: 1, right: "0" }}>
          <HandleOutsideClick
            close={() => {
              if (!conversationOptions) {
                setConversationOptions(false);
                setHandleOutsideClickCalled(true);
                setTimeout(() => setHandleOutsideClickCalled(false), 50);
              }
            }}
          >
            <Container className="column x-fill bg-white border-all px16 py8 br8">
              <Container
                className="button-9 clickable align-center"
                onClick={e => {
                  setDeleteConversationConfirm(true);
                  setConversationOptions(false);
                }}
              >
                <p className="flex-fill">Delete Conversation</p>
                <FontAwesomeIcon className="ml8" icon={faTrash} />
              </Container>
              <Container
                className="button-8 clickable align-center"
                onClick={e => {
                  e.stopPropagation();
                  setBlockModal(!blockModal);
                }}
              >
                <p className="fw-400 flex-fill">Block User</p>
                <FontAwesomeIcon className="ml8" icon={faUserLock} />
              </Container>
            </Container>
          </HandleOutsideClick>
        </div>
      )}
      {deleteConversationConfirm && (
        <ConfirmAlertModal
          close={() => setDeleteConversationConfirm(false)}
          message="Deleting this conversation will be permanent and there will be no way to recover these messages once you have taken this action. Are you sure you would like to delete this conversation and all of your messages associated with it?"
          submit={() =>
            deleteConversation(currentConversation.id, setConversations, userID)
          }
          title="Delete Conversation"
        />
      )}
      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their vents or comments. Are you sure you would like to block this user?"
          submit={() => {
            blockUser(
              userID,
              currentConversation.members.find(memberID => {
                if (memberID != userID) return memberID;
              })
            );
          }}
          title="Block User"
        />
      )}
    </Container>
  );
}

export default ConversationOption;
