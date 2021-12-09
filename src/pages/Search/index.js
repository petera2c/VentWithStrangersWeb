import React, { useState } from "react";
import { useLocation, withRouter } from "react-router-dom";
import { useCollectionOnce } from "react-firebase-hooks/firestore";

import db from "../../config/firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

import LoadingHeart from "../../components/loaders/Heart";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";
import Filters from "../../components/Filters";
import Vent from "../../components/Vent";
import LoadMore from "../../components/LoadMore";

import { searchVents } from "./util";
import { isMobileOrTablet } from "../../util";

function SearchPage() {
  const location = useLocation();
  let { search = "" } = location;
  search = search.slice(1, search.length);
  const ventQuery = db
    .collection("/vents/")
    .where("title", ">=", search)
    .where("title", "<=", search + "\uf8ff")
    .limit(20);

  const [ventsSnapshot] = useCollectionOnce(ventQuery, { idField: "id" });

  return (
    <Page
      className="align-center bg-grey-2"
      description="Search"
      keywords=""
      title={search ? search : "Search"}
    >
      {false && (
        <Container className="gap16">
          <button className="button-2 active no-bold py8 px16 my16 br8">
            Users
          </button>
          <button className="button-2 no-bold py8 px16 my16 br8">Vents</button>
        </Container>
      )}
      <Container
        className={
          "column align-center py32 " +
          (isMobileOrTablet()
            ? "container mobile-full px16"
            : "container large px16")
        }
      >
        {ventsSnapshot && (
          <Container className="x-fill column">
            {ventsSnapshot.docs &&
              ventsSnapshot.docs.map((ventDoc, index) => (
                <Vent
                  key={index}
                  previewMode={true}
                  ventIndex={index}
                  ventInit={{ ...ventDoc.data(), id: ventDoc.id }}
                  searchPreviewMode={true}
                />
              ))}
          </Container>
        )}
        {!ventsSnapshot && <LoadingHeart />}
        {ventsSnapshot && ventsSnapshot.docs.length === 0 && (
          <h4 className="fw-400">No vents found.</h4>
        )}
      </Container>
    </Page>
  );
}

export default withRouter(SearchPage);
