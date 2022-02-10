import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { off } from "firebase/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import loadable from "@loadable/component";
import { Dropdown, message } from "antd";

import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";
import { faVolume } from "@fortawesome/pro-solid-svg-icons/faVolume";
import { faVolumeSlash } from "@fortawesome/pro-solid-svg-icons/faVolumeSlash";
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
  conversationListener,
  deleteConversation,
  getIsChatMuted,
  muteChat,
  readConversation,
} from "./util";

const MakeAvatar = loadable(() => import("../../components/views/MakeAvatar"));

dayjs.extend(relativeTime);

function ConversationOption({
  activeChatUserBasicInfos,
  conversation,
  isActive,
  setActiveConversation,
  setActiveChatUserBasicInfos,
  setConversations,
  setGroupChatEditting,
  setIsCreateGroupModalVisible,
  userID,
}) {
  const isMounted = useIsMounted();
  const navigate = useNavigate();

  const unsubFromConversationUpdates = useRef(false);

  const [blockModal, setBlockModal] = useState(false);
  const [deleteConversationConfirm, setDeleteConversationConfirm] = useState(
    false
  );
  const [isMuted, setIsMuted] = useState();
  const [userBasicInfoArray, setUserBasicInfoArray] = useState([]);
  const hasSeen = conversation[userID];

  useEffect(() => {
    unsubFromConversationUpdates.current = conversationListener(
      conversation,
      isMounted,
      setConversations
    );

    let chatMemberIDArray = [];

    for (let index in conversation.members) {
      if (conversation.members[index] !== userID)
        chatMemberIDArray.push(conversation.members[index]);
    }
    if (chatMemberIDArray.length === 0) return;

    const getAllMemberData = async (chatMemberIDArray) => {
      let tempArray = [];
      for (let index in chatMemberIDArray) {
        await getUserBasicInfo((newBasicUserInfo) => {
          tempArray.push(newBasicUserInfo);
        }, chatMemberIDArray[index]);
      }
      if (isMounted()) {
        setUserBasicInfoArray(tempArray);

        if (isActive) setActiveChatUserBasicInfos(tempArray);
      }
    };
    getAllMemberData(chatMemberIDArray);

    if (isActive && (!hasSeen || conversation.go_to_inbox))
      readConversation(conversation, userID);

    getIsChatMuted(conversation.id, isMounted, setIsMuted, userID);

    return () => {
      if (unsubFromConversationUpdates.current)
        unsubFromConversationUpdates.current();
    };
  }, [
    conversation,
    hasSeen,
    isActive,
    isMounted,
    setActiveChatUserBasicInfos,
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
        setActiveChatUserBasicInfos(userBasicInfoArray);
        setActiveConversation(conversation);
        navigate("/chat?" + conversation.id);
      }}
    >
      <Container className="flex-fill column ov-hidden">
        <Container className="align-center flex-fill gap4 mr16">
          <Container
            className="align-end"
            style={{ width: userBasicInfoArray.length * 20 + 32 + "px" }}
          >
            {userBasicInfoArray.map((userBasicInfo, index) => (
              <Container
                className="relative"
                key={userBasicInfo.id}
                style={{
                  width: "20px",
                }}
              >
                <MakeAvatar
                  displayName={userBasicInfo.displayName}
                  userBasicInfo={userBasicInfo}
                  size="small"
                />
              </Container>
            ))}
          </Container>

          {(conversation.chat_name || userBasicInfoArray) && (
            <DisplayOnlineAndName
              chatName={conversation.chat_name}
              hasSeen={hasSeen}
              userBasicInfo={
                userBasicInfoArray.length > 0 ? userBasicInfoArray[0] : {}
              }
            />
          )}
          {!conversation.chat_name && userBasicInfoArray.length === 1 && (
            <KarmaBadge
              noOnClick
              userBasicInfo={
                userBasicInfoArray.length > 0 ? userBasicInfoArray[0] : {}
              }
            />
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
            <Container
              className="button-8 clickable align-center"
              onClick={(e) => {
                setIsMuted(!isMuted);
                muteChat(conversation.id, userID, !isMuted);
                message.success(
                  "Chat is " + (isMuted ? "unmuted" : "muted") + " :)"
                );
              }}
            >
              <p className="flex-fill ic">
                {isMuted ? "Unmute " : "Mute "}Chat
              </p>
              <FontAwesomeIcon
                className="ml8"
                icon={isMuted ? faVolume : faVolumeSlash}
              />
            </Container>
            <Container
              className="button-8 clickable align-center"
              onClick={(e) => {
                setBlockModal(!blockModal);
              }}
            >
              <p className="ic fw-400 flex-fill">Block User</p>
              <FontAwesomeIcon className="ml8" icon={faUserLock} />
            </Container>
            <Container
              className="button-9 clickable align-center"
              onClick={(e) => {
                setDeleteConversationConfirm(true);
              }}
            >
              <p className="flex-fill ic">Leave Chat</p>
              <FontAwesomeIcon className="ml8" icon={faTrash} />
            </Container>
          </Container>
        }
        placement="bottomRight"
        trigger={["click"]}
      >
        <div className="clickable px8">
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

function DisplayOnlineAndName({ chatName, hasSeen, style, userBasicInfo }) {
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
    <Container className="flex-fill align-center ov-hidden gap8" style={style}>
      <h6 className={"ellipsis " + (hasSeen ? "grey-1" : "primary")}>
        {chatName
          ? chatName
          : userBasicInfo
          ? capitolizeFirstChar(userBasicInfo.displayName)
          : "Anonymous"}
      </h6>
      {!chatName && isUserOnline && <div className="online-dot" />}
    </Container>
  );
}

export default ConversationOption;
