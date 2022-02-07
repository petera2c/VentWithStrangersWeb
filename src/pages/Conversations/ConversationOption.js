import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { off } from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import loadable from "@loadable/component";

import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import Container from "../../components/containers/Container";
import HandleOutsideClick from "../../components/containers/HandleOutsideClick";
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
        (isActive ? "bg-grey-2" : "")
      }
      onClick={() => {
        setActiveUserBasicInfo(userBasicInfo);
        setActiveConversation(conversation);
        navigate("/chat?" + conversation.id);
      }}
    >
      <Container className="flex-fill column ov-hidden">
        <Container className="align-center flex-fill mr16">
          {userBasicInfo && (
            <MakeAvatar
              displayName={userBasicInfo.displayName}
              userBasicInfo={userBasicInfo}
            />
          )}

          {userBasicInfo && (
            <DisplayOnlineAndName
              hasSeen={hasSeen}
              userBasicInfo={userBasicInfo}
            />
          )}
          {userBasicInfo && (
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
      <div
        className="clickable px8"
        onClick={(e) => {
          e.stopPropagation();
          setConversationOptions(!conversationOptions);
        }}
      >
        <FontAwesomeIcon className="grey-9" icon={faEllipsisV} />
      </div>
      {conversationOptions && (
        <div className="absolute top-100 pt4" style={{ zIndex: 1, right: "0" }}>
          <HandleOutsideClick
            close={() => {
              setConversationOptions(false);
            }}
          >
            <Container className="column x-fill bg-white border-all px16 py8 br8">
              <Container
                className="button-9 clickable align-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConversationConfirm(true);
                  setConversationOptions(false);
                }}
              >
                <p className="flex-fill ic">Delete Conversation</p>
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
          message="Deleting this conversation will be permanent. Are you sure you would like to delete this conversation?"
          submit={() => {
            if (unsubFromConversationUpdates.current)
              unsubFromConversationUpdates.current();

            deleteConversation(
              conversation.id,
              navigate,
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

function DisplayOnlineAndName({ hasSeen, userBasicInfo }) {
  const isMounted = useIsMounted();
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    let isUserOnlineSubscribe;

    isUserOnlineSubscribe = getIsUserOnline((isUserOnlineObj) => {
      if (isUserOnlineObj && isUserOnlineObj.state && isMounted()) {
        if (isUserOnlineObj.state === "online") setIsUserOnline(true);
        else setIsUserOnline(false);
      }
    }, userBasicInfo.id);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [isMounted, userBasicInfo]);

  return (
    <Container className="flex-fill align-center ov-hidden">
      <h6 className={"ellipsis mr8 " + (hasSeen ? "grey-1" : "primary")}>
        {userBasicInfo
          ? capitolizeFirstChar(userBasicInfo.displayName)
          : "Anonymous"}
      </h6>
      {isUserOnline && <div className="online-dot mr8" />}
    </Container>
  );
}

export default ConversationOption;
