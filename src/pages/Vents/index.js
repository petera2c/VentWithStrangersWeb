import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faPen } from "@fortawesome/pro-solid-svg-icons/faPen";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";

import firebase from "firebase/app";
import "firebase/database";

import LoadingHeart from "../../components/loaders/Heart";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";
import Filters from "../../components/Filters";
import Vent from "../../components/Vent";
import LoadMoreVents from "../../components/LoadMoreVents";

import { capitolizeFirstChar, isMobileOrTablet } from "../../util";
import { getMetaInformation } from "./util";

function Vents(props) {
  const [vents, setVents] = useState(null);
  const location = useLocation();
  const { pathname, search } = location;

  const { metaDescription, metaTitle } = getMetaInformation(pathname);
  const canLoadMorePosts = false;

  const db = firebase.database();

  const commentsRef = db.ref("/posts/");
  let query = commentsRef.orderByChild("server_timestamp").limitToLast(10);
  if (pathname === "/trending")
    query = commentsRef.orderByChild("likeCounter").limitToLast(10);

  useEffect(() => {
    setVents(null);
    query.once("value", (snapshot) => {
      if (!snapshot) return;
      const value = snapshot.val();
      const exists = snapshot.exists();

      if (exists)
        setVents(
          Object.keys(value).map((ventID) => {
            return { id: ventID, ...value[ventID] };
          })
        );
      else setVents([]);
    });
  }, [props.location]);

  return (
    <Page
      className="column bg-grey-2"
      description={metaDescription}
      keywords=""
      title={metaTitle}
    >
      <Container className="x-fill justify-center align-start">
        <Text
          className={
            "fw-400 fs-20 " +
            (isMobileOrTablet()
              ? "container mobile-full pa16"
              : "container extra-large pr32 pt32")
          }
          text="People care and help is here. Vent and chat anonymously to be a part of a community committed to making the world a better place. This is a website for people that want to be heard and people that want to listen. Your emotional health is our priority."
          type="h2"
        />
      </Container>
      <Container
        className={
          "x-fill justify-center align-start " +
          (isMobileOrTablet() ? "py16" : "py32")
        }
      >
        <Container
          className={
            "column align-center " +
            (isMobileOrTablet()
              ? "container mobile-full pa16"
              : "container large mr32")
          }
        >
          <Container className="x-fill justify-between mb16">
            <Text
              className="primary fs-20"
              text={metaTitle + " Vents"}
              type="h1"
            />
            <Filters />
          </Container>

          {vents && (
            <Container className="x-fill column">
              {vents &&
                vents.map((vent, index) => {
                  return (
                    <Vent
                      key={index + vent.id}
                      previewMode={true}
                      ventID={vent.id}
                    />
                  );
                })}
              {canLoadMorePosts && (
                <LoadMoreVents
                  canLoadMorePosts={canLoadMorePosts}
                  loadMore={() => {}}
                />
              )}
            </Container>
          )}
          {vents === null && <LoadingHeart />}
          {vents && vents.length === 0 && (
            <Text className="fw-400" text="No vents found." type="h4" />
          )}
        </Container>

        {!isMobileOrTablet() && (
          <Container className="container small column">
            <Container className="x-fill column align-start bg-white border-all2 pa16 mb16 br8">
              <Link className="button-3 fs-18 mb16" to="/post-a-problem">
                <FontAwesomeIcon className="mr8" icon={faPen} />
                Post a Vent
              </Link>
              <Link className="button-3 fs-18" to="/vent-to-a-stranger">
                <FontAwesomeIcon className="mr8" icon={faComments} />
                Chat with a Stranger
              </Link>
            </Container>
          </Container>
        )}
      </Container>
    </Page>
  );
}

export default Vents;
