import React, { useContext, useEffect, useRef, useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import { useNavigate } from "react-router-dom";
import loadable from "@loadable/component";
import moment from "moment-timezone";

import { faClock } from "@fortawesome/pro-regular-svg-icons/faClock";
import { faEdit } from "@fortawesome/pro-light-svg-icons/faEdit";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons/faExclamationTriangle";
import { faHeart } from "@fortawesome/pro-regular-svg-icons/faHeart";
import { faHeart as faHeart2 } from "@fortawesome/pro-solid-svg-icons/faHeart";
import { faTrash } from "@fortawesome/pro-duotone-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserContext } from "../../context";

const Button = loadable(() => import("../views/Button"));
const ConfirmAlertModal = loadable(() => import("../containers/Container"));
const Container = loadable(() => import("../containers/Container"));
const DisplayName = loadable(() => import("../views/DisplayName"));
const Options = loadable(() => import("../Options"));
const StarterModal = loadable(() => import("../modals/Starter"));

function Comment({
  arrayLength,
  comment2,
  commentID,
  commentIndex,
  setComments,
  ventUserID,
}) {
  const isMounted = useRef(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [comment, setComment] = useState(comment2);
  const [commentDisplay, setCommentDisplay] = useState("");
  const [commentOptions, setCommentOptions] = useState(false);
  const [commentString, setCommentString] = useState("");
  const [deleteCommentConfirm, setDeleteCommentConfirm] = useState(false);
  const [editingComment, setEditingComment] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [userBasicInfo, setUserBasicInfo] = useState({});

  useEffect(() => {
    isMounted.current = true;

    import("./util").then((functions) => {
      setCommentDisplay(functions.swapTags(comment.text));
    });

    if (user)
      import("./util").then((functions) => {
        functions.getCommentHasLiked(
          commentID,
          isMounted,
          (hasLiked) => {
            if (isMounted.current) setHasLiked(hasLiked);
          },
          user.uid
        );
      });

    import("../../util").then((functions) => {
      if (user)
        functions.hasUserBlockedUser(
          isMounted,
          user.uid,
          comment.userID,
          setIsContentBlocked
        );
      functions.getUserBasicInfo((newBasicUserInfo) => {
        if (isMounted.current) setUserBasicInfo(newBasicUserInfo);
      }, comment.userID);
      functions.getIsUserOnline((isUserOnline) => {
        if (isMounted.current) setIsUserOnline(isUserOnline.state);
      }, comment.userID);
    });

    return () => {
      isMounted.current = false;
    };
  }, [commentID, comment.text, comment.userID, isMounted, user]);

  if (isContentBlocked) return <div />;

  return (
    <Container
      className="x-fill column bg-white mt1"
      style={{
        borderTopLeftRadius: commentIndex === 0 ? "8px" : "",
        borderTopRightRadius: commentIndex === 0 ? "8px" : "",
        borderBottomLeftRadius: arrayLength - 1 === commentIndex ? "8px" : "",
        borderBottomRightRadius: arrayLength - 1 === commentIndex ? "8px" : "",
      }}
    >
      <Container className="justify-between py16">
        <DisplayName
          displayName={userBasicInfo.displayName}
          isUserOnline
          userBasicInfo={userBasicInfo}
          userID={comment.userID}
        />

        <Container className="relative column full-center">
          {user && (
            <Options
              deleteFunction={(commentID) => {
                import("./util").then((functions) => {
                  functions.deleteComment(comment.id, setComments);
                });
              }}
              editFunction={() => {
                setCommentString(comment.text);
                setEditingComment(true);
              }}
              objectID={comment.id}
              objectUserID={comment.userID}
              reportFunction={(option) =>
                import("./util").then((functions) => {
                  functions.reportComment(
                    option,
                    comment.id,
                    user.uid,
                    comment.ventID
                  );
                })
              }
              userID={user.uid}
            />
          )}
        </Container>
      </Container>
      {!editingComment && <p>{commentDisplay}</p>}
      {editingComment && (
        <Container className="column x-fill align-end br8">
          <Container className="relative x-fill">
            <MentionsInput
              className="mentions"
              onChange={(e) => {
                setCommentString(e.target.value);
              }}
              value={commentString}
            >
              <Mention
                className="mentions__mention"
                data={(currentTypingTag, callback) => {
                  import("../Vent/util").then((functions) => {
                    functions.findPossibleUsersToTag(
                      currentTypingTag,
                      comment.ventID,
                      callback
                    );
                  });
                }}
                markup="@{{[[[__id__]]]||[[[__display__]]]}}"
                renderSuggestion={(
                  entry,
                  search,
                  highlightedDisplay,
                  index,
                  focused
                ) => {
                  return (
                    <Container className="button-7 column pa16" key={entry.id}>
                      <h6>{entry.display}</h6>
                    </Container>
                  );
                }}
                trigger="@"
              />
            </MentionsInput>
          </Container>
          <Container className="mt8">
            <Button
              className="button-5 px32 py8 mr8 br4"
              text="Cancel"
              onClick={() => setEditingComment(false)}
            />
            <Button
              className="button-2 px32 py8 br4"
              onClick={() => {
                import("./util").then((functions) => {
                  functions.editComment(comment.id, commentString, setComments);
                });

                setEditingComment(false);
              }}
              text="Save"
            />
          </Container>
        </Container>
      )}
      <Container className="align-center justify-between wrap gap8 py16">
        <Container
          className="clickable align-center"
          onClick={async (e) => {
            e.preventDefault();

            const userInteractionIssues = await import(
              "../../util"
            ).then((functions) => functions.userSignUpProgress(user));

            if (userInteractionIssues) {
              if (userInteractionIssues === "NSI") setStarterModal(true);
              return;
            }

            import("./util").then(async (functions) => {
              await functions.likeOrUnlikeComment(comment, hasLiked, user);
              await functions.getCommentHasLiked(
                commentID,
                isMounted,
                setHasLiked,
                user.uid
              );
            });

            if (hasLiked) comment.like_counter--;
            else comment.like_counter++;
            setComment({ ...comment });
          }}
        >
          <FontAwesomeIcon
            className={`heart ${hasLiked ? "red" : "grey-5"} mr4`}
            icon={hasLiked ? faHeart2 : faHeart}
          />
          <p className="grey-5">
            {comment.like_counter ? comment.like_counter : 0}
          </p>
        </Container>
        <Container className="align-center">
          <FontAwesomeIcon className="clickable grey-5 mr8" icon={faClock} />
          <p className="grey-5 fs-16">
            {moment(comment.server_timestamp).fromNow()}
          </p>
        </Container>
      </Container>

      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Container>
  );
}

export default Comment;
