import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { off } from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import loadable from "@loadable/component";
import { Dropdown } from "antd";

import { faEdit } from "@fortawesome/pro-duotone-svg-icons/faEdit";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import Container from "../../components/containers/Container";
import KarmaBadge from "../../components/views/KarmaBadge";

import {
  blockUser,
  capitolizeFirstChar,
  getIsUserOnline,
  getUserBasicInfo,
  useIsMounted,
} from "../../util";
import {
  deleteConversation,
  conversationListener,
  readConversation,
} from "./util";

const MakeAvatar = loadable(() => import("../../components/views/MakeAvatar"));

dayjs.extend(relativeTime);

function ConversationOption({
  activeUserBasicInfo,
  conversation,
  isActive,
  setActiveConversation,
  setActiveUserBasicInfo,
  setConversations,
  setGroupChatEditting,
  setIsCreateGroupModalVisible,
  userID,
}) {
  const isMounted = useIsMounted();
  const navigate = useNavigate();

  const unsubFromConversationUpdates = useRef(false);

  const [blockModal, setBlockModal] = useState(false);
  const [conversationOptions, setConversationOptions] = useState(false);
  const [deleteConversationConfirm, setDeleteConversationConfirm] = useState(
    false
  );
  const [userBasicInfo, setUserBasicInfo] = useState();
  const hasSeen = conversation[userID];

  useEffect(() => {
    unsubFromConversationUpdates.current = conversationListener(
      conversation,
      isMounted,
      setConversations
    );

    let conversationFriendUserID;

    for (let index in conversation.members) {
      if (conversation.members[index] !== userID)
        conversationFriendUserID = conversation.members[index];
    }
    if (!conversationFriendUserID) return;

    if (!conversation.chat_name)
      getUserBasicInfo((newBasicUserInfo) => {
        if (isMounted()) setUserBasicInfo(newBasicUserInfo);

        if (isMounted() && isActive) setActiveUserBasicInfo(newBasicUserInfo);
      }, conversationFriendUserID);

    if (isActive && (!hasSeen || conversation.go_to_inbox))
      readConversation(conversation, userID);

    return () => {
      if (unsubFromConversationUpdates.current)
        unsubFromConversationUpdates.current();
    };
  }, [
    conversation,
    hasSeen,
    isActive,
    isMounted,
    setActiveUserBasicInfo,
    setConversations,
    userID,
  ]);

  if (!conversation) return <div>loading</div>;

  return (
    <Container
      className={
        "x-fill relative align-center justify-between clickable pa8 br4 " +
        (isActive ? "bg-blue-1" : "")
      }
      onClick={() => {
        setActiveUserBasicInfo(userBasicInfo);
        setActiveConversation(conversation);
        navigate("/chat?" + conversation.id);
      }}
    >
      <Container className="flex-fill column ov-hidden">
        <Container className="align-center flex-fill mr16">
          {(userBasicInfo || conversation.chat_name) && (
            <MakeAvatar
              displayName={
                conversation.chat_name
                  ? conversation.chat_name
                  : userBasicInfo.displayName
              }
              userBasicInfo={conversation.chat_name ? {} : userBasicInfo}
            />
          )}

          {(conversation.chat_name || userBasicInfo) && (
            <DisplayOnlineAndName
              chatName={conversation.chat_name}
              hasSeen={hasSeen}
              userBasicInfo={userBasicInfo}
            />
          )}
          {!conversation.chat_name && userBasicInfo && (
            <KarmaBadge noOnClick userBasicInfo={userBasicInfo} />
          )}
        </Container>
        {conversation.last_message && (
          <p
            className="description"
            style={{
              WebkitLineClamp: 1,
              lineClamp: 1,
            }}
          >
            {conversation.last_message.length > 40
              ? conversation.last_message.substring(0, 40) + "..."
              : conversation.last_message}{" "}
          </p>
        )}
        {conversation.last_updated && (
          <p>{dayjs(conversation.last_updated).fromNow()}</p>
        )}
      </Container>

      <Dropdown
        overlay={
          <Container className="column x-fill bg-white border-all px16 py8 br8">
            {conversation.is_group && (
              <Container
                className="button-8 clickable align-center"
                onClick={(e) => {
                  setConversationOptions(false);
                  setGroupChatEditting(conversation);
                  setIsCreateGroupModalVisible(true);
                }}
              >
                <p className="flex-fill ic">Edit Chat</p>
                <FontAwesomeIcon className="ml8" icon={faEdit} />
              </Container>
            )}
            <Container
              className="button-9 clickable align-center"
              onClick={(e) => {
                setConversationOptions(false);
                setDeleteConversationConfirm(true);
              }}
            >
              <p className="flex-fill ic">Delete Chat</p>
              <FontAwesomeIcon className="ml8" icon={faTrash} />
            </Container>
            <Container
              className="button-8 clickable align-center"
              onClick={(e) => {
                setConversationOptions(false);
                setBlockModal(!blockModal);
              }}
            >
              <p className="ic fw-400 flex-fill">Block User</p>
              <FontAwesomeIcon className="ml8" icon={faUserLock} />
            </Container>
          </Container>
        }
        placement="bottomRight"
        trigger={["click"]}
        visible={conversationOptions}
      >
        <div
          className="clickable px8"
          onClick={(e) => {
            setConversationOptions(!conversationOptions);
          }}
        >
          <FontAwesomeIcon className="grey-9" icon={faEllipsisV} />
        </div>
      </Dropdown>
      {deleteConversationConfirm && (
        <ConfirmAlertModal
          close={() => setDeleteConversationConfirm(false)}
          message="Deleting this conversation will be permanent. Are you sure you would like to delete this conversation?"
          submit={() => {
            if (unsubFromConversationUpdates.current)
              unsubFromConversationUpdates.current();

            deleteConversation(
              conversation.id,
              navigate,
              setActiveConversation,
              setConversations,
              userID
            );
          }}
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

function DisplayOnlineAndName({ chatName, hasSeen, userBasicInfo }) {
  const isMounted = useIsMounted();
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    let isUserOnlineSubscribe;

    if (!chatName)
      isUserOnlineSubscribe = getIsUserOnline((isUserOnlineObj) => {
        if (isUserOnlineObj && isUserOnlineObj.state && isMounted()) {
          if (isUserOnlineObj.state === "online") setIsUserOnline(true);
          else setIsUserOnline(false);
        }
      }, userBasicInfo.id);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [chatName, isMounted, userBasicInfo]);

  return (
    <Container className="flex-fill align-center ov-hidden">
      <h6 className={"ellipsis mr8 " + (hasSeen ? "grey-1" : "primary")}>
        {chatName
          ? chatName
          : userBasicInfo
          ? capitolizeFirstChar(userBasicInfo.displayName)
          : "Anonymous"}
      </h6>
      {!chatName && isUserOnline && <div className="online-dot mr8" />}
    </Container>
  );
}

export default ConversationOption;
