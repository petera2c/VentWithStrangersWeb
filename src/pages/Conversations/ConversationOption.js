import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { useLocation, useHistory } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Button from "../../components/views/Button";
import HandleOutsideClick from "../../components/containers/HandleOutsideClick";
import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import KarmaBadge from "../../components/KarmaBadge";

import {
  deleteConversation,
  getConversationBasicData,
  readConversation
} from "./util";

import {
  blockUser,
  calculateKarma,
  capitolizeFirstChar,
  isMobileOrTablet
} from "../../util";

function ConversationOption({
  conversation,
  conversationPartnerData,
  isActive,
  isLastItem,
  setActiveConversation,
  setConversationsBasicDatas,
  userID
}) {
  const history = useHistory();
  const [blockModal, setBlockModal] = useState(false);
  const [conversationOptions, setConversationOptions] = useState(false);
  const [deleteConversationConfirm, setDeleteConversationConfirm] = useState(
    false
  );
  const [handleOutsideClickCalled, setHandleOutsideClickCalled] = useState(
    false
  );

  useEffect(() => {
    getConversationBasicData(conversation, setConversationsBasicDatas, userID);
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
        setActiveConversation(oldActiveConversationID => {
          if (oldActiveConversationID !== conversation.id)
            return conversation.id;
        });
        history.push("/conversations?" + conversation.id);
      }}
    >
      <Container className="flex-fill column ov-hidden">
        <Container>
          <h6 className={"mr8 " + (hasSeen ? "grey-1" : "primary")}>
            {conversationPartnerData
              ? capitolizeFirstChar(conversationPartnerData.displayName)
              : "Anonymous"}
          </h6>
          {conversationPartnerData && (
            <KarmaBadge karma={calculateKarma(conversationPartnerData)} />
          )}
        </Container>
        {conversation.last_message && (
          <p>
            {conversation.last_message.length > 40
              ? conversation.last_message.substring(0, 40) + "..."
              : conversation.last_message}{" "}
            ·{" "}
            {moment(conversation.last_updated)
              .subtract(1, "minute")
              .fromNow()}
          </p>
        )}
      </Container>
      <FontAwesomeIcon
        className="clickable grey-9 px8"
        icon={faEllipsisV}
        onClick={e => {
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
                  e.preventDefault();
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
          submit={() => deleteConversation(conversation.id, userID)}
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
              conversation.members.find(memberID => {
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
