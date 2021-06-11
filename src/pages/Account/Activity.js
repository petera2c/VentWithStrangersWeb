import React, { useEffect, useState } from "react";
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

import { getUserDisplayName, isMobileOrTablet } from "../../util";
import { getUsersPosts } from "./util";

function ActivitySection({ user }) {
  const history = useHistory();
  const location = useLocation();
  let { search } = location;
  if (!user && !search) {
    history.push("/");
    return <div />;
  }
  const [postsSection, setPostsSection] = useState(true);
  const [canLoadMore, setCanLoadMore] = useState();
  const [userDisplayName, setUserDisplayName] = useState("");

  if (search) search = search.substring(1);
  if (!search && user) search = user.uid;

  const ventQuery = db
    .collection("/vents/")
    .where("userID", "==", search)
    .orderBy("server_timestamp", "desc")
    .limit(20);

  const [vents] = useCollectionData(ventQuery, { idField: "id" });

  const commentQuery = db
    .collection("/comments/")
    .where("userID", "==", search)
    .orderBy("server_timestamp", "desc")
    .limit(20);
  const [comments] = useCollectionData(commentQuery, { idField: "id" });
  const isActive = test => {
    if (test) return " active";
    else return "";
  };

  useEffect(() => {
    if (search) getUserDisplayName(setUserDisplayName, search);
  }, []);

  return (
    <Container
      className={
        "container column px16 " +
        (isMobileOrTablet() ? "mobile-full" : "large")
      }
    >
      {false && search && (
        <Container className="ov-hidden column bg-white pa16 mb16 br8">
          <h6>{userDisplayName}</h6>
          <h6>106 Karma</h6>
        </Container>
      )}

      <h4 className="mb16">Activity</h4>
      <Container className="ov-hidden column bg-white mb16 br8">
        <Container>
          <Container
            className={
              "x-50 button-4 clickable full-center py16" +
              isActive(postsSection)
            }
            onClick={() => setPostsSection(true)}
          >
            <h5 className="tac">Posts</h5>
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
            <h5 className="tac">Comments</h5>
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
            <h4 className="fw-400">No vents found.</h4>
          )}
          {canLoadMore && (
            <LoadMore canLoadMore={canLoadMore} loadMore={() => {}}>
              <Container className="clickable x-fill column bg-white mb16 br8">
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
          <Container className="column br8">
            {comments &&
              comments.map((comment, index) => {
                return (
                  <Link key={index} to={"/problem/" + comment.ventID + "/"}>
                    <Comment
                      arrayLength={comments.length}
                      commentID={comment.id}
                      commentIndex={index}
                      comment2={comment}
                      key={index}
                    />
                  </Link>
                );
              })}
          </Container>
          {comments && comments.length === 0 && (
            <h4 className="fw-400">No comments found.</h4>
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
