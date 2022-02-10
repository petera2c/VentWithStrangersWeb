import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { off } from "firebase/database";
import loadable from "@loadable/component";
import { Divider, message } from "antd";
import algoliasearch from "algoliasearch";

import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../containers/Container";
import KarmaBadge from "../../views/KarmaBadge";

import { UserContext } from "../../../context";

import { getIsUserOnline, getUserBasicInfo, useIsMounted } from "../../../util";
import { saveGroup } from "./util";
const MakeAvatar = loadable(() => import("../../views/MakeAvatar"));

const searchClient = algoliasearch(
  "N7KIA5G22X",
  "a2fa8c0a85b2020696d2da1780d7dfdb"
);

const usersIndex = searchClient.initIndex("users");
const GROUP_MAX = 5;

function GroupChatCreateModal({ close, groupChatEditting }) {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { userBasicInfo } = useContext(UserContext);

  const [chatNameString, setChatNameString] = useState(
    groupChatEditting && groupChatEditting.chat_name
      ? groupChatEditting.chat_name
      : ""
  );
  const [existingUsers, setExistingUsers] = useState([]);
  const [users, setUsers] = useState(groupChatEditting ? [] : [userBasicInfo]);
  const [hits, setHits] = useState([]);
  const [userSearchString, setUserSearchString] = useState("");

  useEffect(() => {
    if (groupChatEditting && groupChatEditting.members) {
      for (let index in groupChatEditting.members) {
        getUserBasicInfo((userBasicInfo) => {
          if (isMounted())
            setExistingUsers((existingUsers) => {
              existingUsers.push(userBasicInfo);
              return [...existingUsers];
            });
        }, groupChatEditting.members[index]);
      }
    }
  }, [groupChatEditting, isMounted]);

  const isNewGroupChatOrOwner =
    !groupChatEditting ||
    (groupChatEditting && groupChatEditting.group_owner === userBasicInfo.id);

  return (
    <Container className="modal-container full-center normal-cursor">
      <Container className="modal container large column bg-white br4">
        <Container className="x-fill justify-center bg-grey-10 py16">
          <h4 className="grey-11 tac">
            {groupChatEditting
              ? groupChatEditting.chat_name
              : "Create New Group Chat"}
          </h4>
        </Container>
        <Container className="column flex-fill ov-auto py16 px32">
          {existingUsers && existingUsers.length > 0 && (
            <Container className="column gap16">
              <h4>Users In Chat</h4>
              {existingUsers.map((user) => {
                return (
                  <DisplayExistingUser
                    groupChatEditting={groupChatEditting}
                    key={user.id}
                    setExistingUsers={setExistingUsers}
                    user={user}
                    userBasicInfo={userBasicInfo}
                  />
                );
              })}
            </Container>
          )}

          {groupChatEditting &&
            groupChatEditting.group_owner === userBasicInfo.id && <Divider />}

          {isNewGroupChatOrOwner && (
            <Container className="column gap16">
              <h4>Change Chat Name or Add Users</h4>
              <input
                className="fs-22 br4 pa8"
                onChange={(e) => {
                  setChatNameString(e.target.value);
                }}
                placeholder="Chat Name"
                value={chatNameString}
              />
              <input
                className="fs-22 br4 pa8"
                onChange={(e) => {
                  setUserSearchString(e.target.value);
                  usersIndex
                    .search(e.target.value, {
                      hitsPerPage: 10,
                    })
                    .then(({ hits }) => {
                      setHits(hits);
                    });
                }}
                placeholder="Search for people to add by name or their ID"
                value={userSearchString}
              />
              {hits.length > 0 && (
                <Container className="column gap16">
                  <h4>Searched For People</h4>
                  <Container className="wrap gap8">
                    {hits.map((hit, index) => {
                      if (
                        users.find((user) => user.id === hit.objectID) ||
                        existingUsers.find((user) => user.id === hit.objectID)
                      ) {
                        return (
                          <div
                            key={hit.objectID + "s"}
                            style={{ display: "none" }}
                          />
                        );
                      } else
                        return (
                          <HitDisplay
                            existingUsers={existingUsers}
                            hit={hit}
                            key={hit.objectID}
                            setUsers={setUsers}
                          />
                        );
                    })}
                  </Container>
                </Container>
              )}
              {users.length > 0 && (
                <Container className="column gap16">
                  <h4>Selected People</h4>
                  <Container
                    className="align-start wrap gap8"
                    style={{ maxHeight: "100px" }}
                  >
                    {users.map((user) => {
                      return (
                        <button
                          className="button-2 br4 gap8 pa8"
                          key={user.id}
                          onClick={() => {
                            if (user.id === userBasicInfo.id) {
                              return message.error(
                                "You can not remove yourself."
                              );
                            }

                            setUsers((users) => {
                              users.splice(
                                users.findIndex(
                                  (user2) => user2.id === user.id
                                ),
                                1
                              );
                              return [...users];
                            });
                          }}
                        >
                          <Container className="gap4">
                            <MakeAvatar
                              displayName={user.displayName}
                              size="small"
                              userBasicInfo={user}
                            />
                            <Container className="full-center flex-fill ov-hidden ic">
                              <h5 className="ic ellipsis fw-400 grey-11">
                                {user.displayName}
                              </h5>
                            </Container>
                          </Container>
                          <KarmaBadge
                            noOnClick={true}
                            noTooltip={true}
                            userBasicInfo={user}
                          />
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      );
                    })}
                  </Container>
                </Container>
              )}
            </Container>
          )}
        </Container>
        {isNewGroupChatOrOwner && (
          <Container className="full-center border-top pa16">
            <button
              className="grey-1 border-all py8 px32 mx4 br4"
              onClick={() => close()}
            >
              Cancel
            </button>
            <button
              className="button-2 py8 px32 mx4 br4"
              onClick={() => {
                saveGroup(
                  chatNameString,
                  existingUsers,
                  groupChatEditting,
                  navigate,
                  userBasicInfo.id,
                  users
                );
                close();
              }}
            >
              Save
            </button>
          </Container>
        )}
      </Container>
      <Container className="modal-background" onClick={close} />
    </Container>
  );
}

function HitDisplay({ existingUsers, hit, setUsers }) {
  const isMounted = useIsMounted();
  const [userBasicInfo, setUserBasicInfo] = useState();

  useEffect(() => {
    getUserBasicInfo((userBasicInfo) => {
      if (isMounted()) setUserBasicInfo(userBasicInfo);
    }, hit.objectID);
  }, [hit, isMounted, setUserBasicInfo]);

  return (
    <Container
      className="button-8 align-center gap8"
      onClick={() => {
        setUsers((users) => {
          if (existingUsers.length + users.length >= GROUP_MAX) {
            message.info(`Groups can have a max of ${GROUP_MAX} people!`);
            return users;
          }
          users.push(userBasicInfo);
          return [...users];
        });
      }}
    >
      <Container className="gap4">
        {userBasicInfo && (
          <MakeAvatar
            displayName={hit.displayName}
            size="small"
            userBasicInfo={userBasicInfo}
          />
        )}
        <Container className="full-center flex-fill ov-hidden ic">
          <h5 className="ic ellipsis fw-400 grey-11">{hit.displayName}</h5>
        </Container>
      </Container>
      {userBasicInfo && (
        <KarmaBadge
          noOnClick={true}
          noTooltip={true}
          userBasicInfo={userBasicInfo}
        />
      )}
    </Container>
  );
}

function DisplayExistingUser({
  groupChatEditting,
  setExistingUsers,
  user,
  userBasicInfo,
}) {
  const isMounted = useIsMounted();
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    let isUserOnlineSubscribe;

    isUserOnlineSubscribe = getIsUserOnline((isUserOnlineObj) => {
      if (isUserOnlineObj && isUserOnlineObj.state && isMounted()) {
        if (isUserOnlineObj.state === "online") setIsUserOnline(true);
        else setIsUserOnline(false);
      }
    }, user.id);

    return () => {
      if (isUserOnlineSubscribe) off(isUserOnlineSubscribe);
    };
  }, [isMounted, user]);

  return (
    <Container className="align-center br4 gap8">
      <Container className="align-center gap8">
        <MakeAvatar
          displayName={user.displayName}
          size="small"
          userBasicInfo={user}
        />
        <Link
          className="full-center flex-fill ov-hidden ic gap4"
          to={"/profile?" + user.id}
        >
          <h5 className="button-1 ellipsis grey-11">{user.displayName}</h5>
        </Link>
        {isUserOnline && <div className="online-dot" />}
      </Container>
      <KarmaBadge noOnClick={true} noTooltip={true} userBasicInfo={user} />
      {groupChatEditting && groupChatEditting.group_owner === userBasicInfo.id && (
        <FontAwesomeIcon
          className="button-9"
          icon={faTimes}
          onClick={() => {
            if (user.id === userBasicInfo.id) {
              return message.error("You can not remove yourself.");
            }

            setExistingUsers((users) => {
              users.splice(
                users.findIndex((user2) => user2.id === user.id),
                1
              );
              return [...users];
            });
          }}
        />
      )}
    </Container>
  );
}

export default GroupChatCreateModal;
