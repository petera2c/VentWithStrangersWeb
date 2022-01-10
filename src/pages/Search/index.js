import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import algoliasearch from "algoliasearch";
import { Space } from "antd";

import db from "../../config/firebase";

import LoadingHeart from "../../components/loaders/Heart";
import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Vent from "../../components/Vent";
import LoadMore from "../../components/LoadMore";
import KarmaBadge from "../../components/KarmaBadge";
import User from "../../components/User";

import {
  calculateKarma,
  capitolizeFirstChar,
  isMobileOrTablet
} from "../../util";

const searchClient = algoliasearch(
  "N7KIA5G22X",
  "a2fa8c0a85b2020696d2da1780d7dfdb"
);
const usersIndex = searchClient.initIndex("users");
const ventsIndex = searchClient.initIndex("vents");

function SearchPage({ location }) {
  let search = location.search
    ? decodeURI(location.search.substring(1, location.search.length))
    : "";

  const [users, setUsers] = useState([]);
  const [vents, setVents] = useState([]);
  const [isUsers, setIsUsers] = useState(true);

  useEffect(() => {
    if (isUsers) {
      usersIndex
        .search(search, {
          hitsPerPage: 5
        })
        .then(({ hits }) => {
          setUsers(hits);
        })
        .catch(err => {});
    } else {
      ventsIndex
        .search(search, {
          hitsPerPage: 5
        })
        .then(({ hits }) => {
          setVents(hits);
        })
        .catch(err => {});
    }
  }, [search, isUsers]);

  return (
    <Page
      className="align-center bg-grey-2"
      description="Search"
      keywords=""
      title={search ? search : "Search"}
    >
      <Container className="gap16">
        <button
          className={
            "button-2 no-bold py8 px16 my16 br8 " + (isUsers ? "active" : "")
          }
          onClick={() => setIsUsers(true)}
        >
          Users
        </button>
        <button
          className={
            "button-2 no-bold py8 px16 my16 br8 " + (isUsers ? "" : "active")
          }
          onClick={() => setIsUsers(false)}
        >
          Vents
        </button>
      </Container>
      {isUsers && (
        <Container
          className={
            "wrap full-center gap32 " +
            (isMobileOrTablet()
              ? "container mobile-full px16"
              : "container large px16")
          }
        >
          {users &&
            users.map((user, index) => {
              const displayName = user.displayName
                ? capitolizeFirstChar(user.displayName)
                : "Anonymous";

              return (
                <User
                  displayName={displayName}
                  key={user.objectID}
                  showAdditionaluserInformation={false}
                  showMessageUser={false}
                  userID={user.objectID}
                />
              );
            })}
          {!users && <LoadingHeart />}
          {users && users.length === 0 && (
            <h4 className="fw-400">No users found.</h4>
          )}
        </Container>
      )}
      {!isUsers && (
        <Container
          className={
            "column align-center py32 " +
            (isMobileOrTablet()
              ? "container mobile-full px16"
              : "container large px16")
          }
        >
          {vents && (
            <Space className="x-fill" direction="vertical" size="middle">
              {vents &&
                vents.map((vent, index) => (
                  <Vent
                    key={vent.objectID}
                    previewMode={true}
                    showVentHeader={false}
                    ventIndex={index}
                    ventInit={{ ...vent, id: vent.objectID }}
                    searchPreviewMode={true}
                  />
                ))}
            </Space>
          )}
          {!vents && <LoadingHeart />}
          {vents && vents.length === 0 && (
            <h4 className="fw-400">No vents found.</h4>
          )}
        </Container>
      )}
    </Page>
  );
}

export default SearchPage;
