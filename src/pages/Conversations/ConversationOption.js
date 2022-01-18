import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";

import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import Container from "../../components/containers/Container";
import HandleOutsideClick from "../../components/containers/HandleOutsideClick";
import KarmaBadge from "../../components/KarmaBadge";
import MakeAvatar from "../../components/MakeAvatar";

import { blockUser, calculateKarma, capitolizeFirstChar } from "../../util";
import {
  deleteConversation,
  getConversationBasicData,
  conversationListener,
  readConversation,
} from "./util";

function ConversationOption({
  conversation,
  conversationPartnerData,
  isActive,
  isLastItem,
  setActiveConversation,
  setConversationsBasicDatas,
  setConversations,
  userID,
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
  const hasSeen = conversation[userID];

  useEffect(() => {
    let conversationUpdatedListenerUnsubscribe;

    conversationUpdatedListenerUnsubscribe = conversationListener(
      conversation,
      setConversations
    );

    getConversationBasicData(conversation, setConversationsBasicDatas, userID);
    if (isActive && !hasSeen) readConversation(conversation, userID);

    return () => {
      if (conversationUpdatedListenerUnsubscribe)
        conversationUpdatedListenerUnsubscribe();
    };
  }, [hasSeen, isActive]);

  if (!conversation) return <div>loading</div>;

  return (
    <Container
      className={
        "x-fill relative align-center justify-between clickable pa8 br4 " +
        (isActive ? "bg-grey-2" : "")
      }
      onClick={() => {
        setActiveConversation(conversation.id);
        navigate("/conversations?" + conversation.id);
      }}
    >
      <Container className="flex-fill column ov-hidden">
        <Container className="align-center flex-fill mr16">
          {conversationPartnerData && (
            <MakeAvatar
              displayName={conversationPartnerData.displayName}
              userBasicInfo={conversationPartnerData}
            />
          )}

          <Container className="flex-fill align-center ov-hidden">
            <h6 className={"ellipsis mr8 " + (hasSeen ? "grey-1" : "primary")}>
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
            <KarmaBadge noOnClick userBasicInfo={conversationPartnerData} />
          )}
        </Container>
        {conversation.last_message && (
          <p>
            {conversation.last_message.length > 40
              ? conversation.last_message.substring(0, 40) + "..."
              : conversation.last_message}{" "}
            · {moment(conversation.last_updated).fromNow()}
          </p>
        )}
      </Container>
      <div
        className="clickable px8"
        onClick={(e) => {
          e.stopPropagation();
          if (!handleOutsideClickCalled)
            setConversationOptions(!conversationOptions);
        }}
      >
        <FontAwesomeIcon className="grey-9" icon={faEllipsisV} />
      </div>
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
                onClick={(e) => {
                  setDeleteConversationConfirm(true);
                  setConversationOptions(false);
                }}
              >
                <p className="flex-fill">Delete Conversation</p>
                <FontAwesomeIcon className="ml8" icon={faTrash} />
              </Container>
              <Container
                className="button-8 clickable align-center"
                onClick={(e) => {
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
            deleteConversation(conversation.id, setConversations, userID)
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
              conversation.members.find((memberID) => {
                if (memberID !== userID) return memberID;
                else return undefined;
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
