import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loadable from "@loadable/component";
import { message } from "antd";
import algoliasearch from "algoliasearch";

import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../containers/Container";
import KarmaBadge from "../../views/KarmaBadge";

import { UserContext } from "../../../context";

import { getUserBasicInfo, useIsMounted } from "../../../util";
import { createGroup } from "./util";
const MakeAvatar = loadable(() => import("../../views/MakeAvatar"));

const searchClient = algoliasearch(
  "N7KIA5G22X",
  "a2fa8c0a85b2020696d2da1780d7dfdb"
);

const usersIndex = searchClient.initIndex("users");
const GROUP_MAX = 5;

function ConfirmAlertModal({ close }) {
  const navigate = useNavigate();
  const { userBasicInfo } = useContext(UserContext);

  const [users, setUsers] = useState([userBasicInfo]);
  const [hits, setHits] = useState([]);
  const [userText, setUserText] = useState("");

  return (
    <Container className="modal-container full-center normal-cursor">
      <Container className="modal container large column bg-white br4">
        <Container className="x-fill justify-center bg-grey-10 py16">
          <h4 className="grey-11 tac">Create New Group Chat</h4>
        </Container>
        <Container className="flex-fill column x-fill ov-auto gap16 py16 px32">
          <input
            className="fs-22 br4 pa8"
            onChange={(e) => {
              setUserText(e.target.value);
              usersIndex
                .search(e.target.value, {
                  hitsPerPage: 5,
                })
                .then(({ hits }) => {
                  setHits(hits);
                });
            }}
            placeholder="Search for people to add :)"
            value={userText}
          />
          {hits.length > 0 && (
            <Container className="column gap16">
              <h4 className="underline">Searched Users</h4>
              <Container className="wrap gap8">
                {hits.map((hit, index) => {
                  if (users.find((user) => user.id === hit.objectID)) {
                    return (
                      <div
                        key={hit.objectID + "s"}
                        style={{ display: "none" }}
                      />
                    );
                  } else
                    return (
                      <HitDisplay
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
              <h4>Selected Users</h4>
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
                          return message.error("You can not remove yourself.");
                        }

                        setUsers((users) => {
                          users.splice(
                            users.findIndex((user2) => user2.id === user.id),
                            1
                          );
                          return [...users];
                        });
                      }}
                    >
                      <Container>
                        <MakeAvatar
                          displayName={user.displayName}
                          size="small"
                          userBasicInfo={user}
                        />
                        <Container className="full-center flex-fill ov-hidden ic gap4">
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
              createGroup(navigate, users);
              close();
            }}
          >
            Create
          </button>
        </Container>
      </Container>
      <Container className="modal-background" onClick={close} />
    </Container>
  );
}

function HitDisplay({ hit, setUsers }) {
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
          if (users.length >= GROUP_MAX) {
            message.info(`Groups can have a max of ${GROUP_MAX} people!`);
            return users;
          }
          users.push(userBasicInfo);
          return [...users];
        });
      }}
    >
      <Container>
        {userBasicInfo && (
          <MakeAvatar
            displayName={hit.displayName}
            size="small"
            userBasicInfo={userBasicInfo}
          />
        )}
        <Container className="full-center flex-fill ov-hidden ic gap4">
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

export default ConfirmAlertModal;
