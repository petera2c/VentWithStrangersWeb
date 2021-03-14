import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import db from "../../config/firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import LoadingHeart from "../../components/loaders/Heart";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import Vent from "../../components/Vent";
import Comment from "../../components/Comment";

import LoadMore from "../../components/LoadMore";

import { isMobileOrTablet } from "../../util";
import { getUsersPosts } from "./util";

function ActivitySection({ user }) {
  const [postsSection, setPostsSection] = useState(true);
  const [canLoadMore, setCanLoadMore] = useState();

  const ventQuery = db
    .collection("/vents/")
    .where("userID", "==", user.uid)
    .orderBy("server_timestamp", "desc")
    .limit(20);

  const [vents] = useCollectionData(ventQuery, { idField: "id" });

  const commentQuery = db
    .collection("/comments/")
    .where("userID", "==", user.uid)
    .orderBy("server_timestamp", "desc")
    .limit(20);

  const [comments] = useCollectionData(commentQuery, { idField: "id" });
  const isActive = test => {
    if (test) return " active";
    else return "";
  };

  const location = useLocation();
  const { search } = location;

  return (
    <Container
      className={
        "container column px16 " +
        (isMobileOrTablet() ? "mobile-full" : "large")
      }
    >
      <Text className="mb16" text="Activity" type="h4" />
      <Container className="ov-hidden column bg-white border-all2 mb16 br8">
        <Container>
          <Container
            className={
              "x-50 button-4 clickable full-center py16" +
              isActive(postsSection)
            }
            onClick={() => setPostsSection(true)}
          >
            <Text className="tac" text="Posts" type="h5" />
          </Container>
          <Container
            className={
              "x-50 button-4 clickable full-center py16" +
              isActive(!postsSection)
            }
            onClick={() => {
              setPostsSection(false);
            }}
          >
            <Text className="tac" text="Comments" type="h5" />
          </Container>
        </Container>
      </Container>
      {postsSection && (
        <Container className="x-fill column">
          {vents &&
            vents.map((vent, index) => (
              <Vent
                history={history}
                key={index}
                previewMode={true}
                ventID={vent.id}
              />
            ))}
          {vents && vents.length === 0 && (
            <Text className="fw-400" text="No vents found." type="h4" />
          )}
          {canLoadMore && (
            <LoadMore canLoadMore={canLoadMore} loadMore={() => {}}>
              <Container className="clickable x-fill column bg-white border-all2 mb16 br8">
                <Container className="justify-between pt16 px32">
                  <Container>
                    <div className="round-icon bg-grey-2 mr8" />
                    <div
                      className=" bg-grey-2 br16"
                      style={{ width: "140px", height: "24px" }}
                    />
                  </Container>
                  <div
                    className="bg-grey-2 br16"
                    style={{ width: "140px", height: "24px" }}
                  />
                </Container>
                <Container className="pt16 px32">
                  <div
                    className="x-fill bg-grey-2 br8"
                    style={{ height: "100px" }}
                  />
                </Container>
                <Container className="py16 px32">
                  <div
                    className=" bg-grey-2 br16"
                    style={{ width: "140px", height: "24px" }}
                  />
                </Container>
              </Container>
            </LoadMore>
          )}
        </Container>
      )}
      {!postsSection && (
        <Container className="x-fill column">
          <Container className="column border-all2 br8">
            {comments &&
              comments.map((comment, index) => {
                return (
                  <Link key={index} to={"/problem/" + comment.problemID + "/"}>
                    <Comment
                      arrayLength={comments.length}
                      commentID={comment.id}
                      commentIndex={index}
                      comment2={comment}
                      ventID={comment.ventID}
                      key={index}
                    />
                  </Link>
                );
              })}
          </Container>
          {comments && comments.length === 0 && (
            <Text className="fw-400" text="No comments found." type="h4" />
          )}
        </Container>
      )}
      {((!vents && postsSection) || (!comments && !postsSection)) && (
        <Container className="x-fill full-center">
          <LoadingHeart />
        </Container>
      )}
    </Container>
  );
}

export default ActivitySection;
