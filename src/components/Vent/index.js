import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loadable from "@loadable/component";
import moment from "moment-timezone";
import { MentionsInput, Mention } from "react-mentions";
import { Button, Dropdown } from "antd";

import { faBirthdayCake } from "@fortawesome/pro-duotone-svg-icons/faBirthdayCake";
import { faClock } from "@fortawesome/pro-regular-svg-icons/faClock";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../containers/Container";

import { UserContext } from "../../context";

import { capitolizeFirstChar } from "../../util";

const Comment = loadable(() => import("../Comment"));
const ConfirmAlertModal = loadable(() => import("../modals/ConfirmAlert"));
const KarmaBadge = loadable(() => import("../views/KarmaBadge"));
const LoadingHeart = loadable(() => import("../views/loaders/Heart"));
const MakeAvatar = loadable(() => import("../views/MakeAvatar"));
const Options = loadable(() => import("../Options"));
const StarterModal = loadable(() => import("../modals/Starter"));

const SmartLink = ({ children, className, disablePostOnClick, to }) => {
  if (disablePostOnClick || !to) {
    return <Container className={className}>{children}</Container>;
  } else {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    );
  }
};

function Vent({
  disablePostOnClick,
  displayCommentField,
  isOnSingleVentPage,
  previewMode,
  searchPreviewMode,
  setTitle,
  ventID,
  ventInit,
}) {
  const isMounted = useRef(false);
  const textInput = useRef(null);
  const { user, userBasicInfo } = useContext(UserContext);

  const [activeSort, setActiveSort] = useState("First");
  const [author, setAuthor] = useState({});
  const [blockModal, setBlockModal] = useState(false);
  const [canLoadMoreComments, setCanLoadMoreComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentString, setCommentString] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [vent, setVent] = useState(ventInit);

  const navigate = useNavigate();

  const [isUserAccountNew, setIsUserAccountNew] = useState();
  const [signUpProgressFunction, setSignUpProgressFunction] = useState();
  const [partialLink, setPartialLink] = useState("");
  const [ventPreview, setVentPreview] = useState("");

  const [
    isUserKarmaSufficientFunction,
    setIsUserKarmaSufficientFunction,
  ] = useState();

  useEffect(() => {
    isMounted.current = true;

    let newCommentListenerUnsubscribe;

    const ventSetUp = (newVent) => {
      import("./util").then((functions) => {
        setPartialLink(functions.getVentPartialLink(newVent));
        setVentPreview(functions.getVentDescription(previewMode, newVent));
      });

      if (setTitle && newVent && newVent.title && isMounted.current)
        setTitle(newVent.title);

      import("../../util").then((functions) => {
        functions.getIsUserOnline((isUserOnline) => {
          if (isMounted.current) setIsUserOnline(isUserOnline.state);
        }, newVent.userID);

        functions.getUserBasicInfo((author) => {
          if (isMounted.current) setAuthor(author);
        }, newVent.userID);

        if (user)
          functions.hasUserBlockedUser(
            isMounted,
            user.uid,
            newVent.userID,
            setIsContentBlocked
          );

        setIsUserAccountNew(functions.isUserAccountNew(userBasicInfo));

        setSignUpProgressFunction(
          functions.userSignUpProgressFunction(setStarterModal, user)
        );
      });

      if (isMounted.current) setVent(newVent);
    };

    import("./util").then((functions) => {
      if (!vent) {
        functions.getVent(ventSetUp, ventID);
      } else ventSetUp(vent);

      if (!searchPreviewMode && displayCommentField)
        newCommentListenerUnsubscribe = functions.newVentCommentListener(
          isMounted,
          setCanLoadMoreComments,
          setComments,
          user ? user.uid : "",
          ventID
        );

      if (!searchPreviewMode && !previewMode) {
        functions.getVentComments(
          activeSort,
          comments,
          isMounted,
          setCanLoadMoreComments,
          setComments,
          false,
          ventID
        );
      }

      if (user && !searchPreviewMode)
        functions.ventHasLiked(
          (newHasLiked) => {
            if (isMounted.current) setHasLiked(newHasLiked);
          },
          user.uid,
          ventID
        );
    });

    return () => {
      isMounted.current = false;

      if (newCommentListenerUnsubscribe) newCommentListenerUnsubscribe();
    };
  }, [isMounted, user, ventID]);

  if ((!vent || (vent && !vent.server_timestamp)) && isOnSingleVentPage)
    return (
      <Container className="x-fill full-center">
        <LoadingHeart />
      </Container>
    );

  if (isContentBlocked) return <div />;

  return (
    <Container className="x-fill">
      {vent && (
        <Container className="x-fill column bg-white pt16 br8">
          <Container
            className={`column border-bottom gap8 py16 px32 ${
              disablePostOnClick ? "" : "clickable"
            }`}
            onClick={() => {
              if (!disablePostOnClick) navigate("/vent/" + vent.id);
            }}
          >
            <Container className="flex x-fill align-center">
              <MakeAvatar
                displayName={author.displayName}
                userBasicInfo={author}
              />
              <Container className="flex-fill align-center ov-hidden gap8">
                <Link
                  className="ov-hidden"
                  onClick={(e) => e.stopPropagation()}
                  to={"/profile?" + author.id}
                >
                  <h3 className="button-1 fs-20 grey-11 ellipsis">
                    {capitolizeFirstChar(author.displayName)}
                  </h3>
                </Link>
                {isUserOnline && <div className="online-dot" />}
                <KarmaBadge userBasicInfo={author} />
              </Container>
              {vent.is_birthday_post && (
                <Container className="align-center gap8">
                  <FontAwesomeIcon
                    className="orange"
                    icon={faBirthdayCake}
                    size="3x"
                  />
                  <FontAwesomeIcon
                    className="purple"
                    icon={faBirthdayCake}
                    size="3x"
                  />
                </Container>
              )}
              {user && (
                <Options
                  deleteFunction={(ventID) => {
                    import("./util").then((functions) => {
                      functions.deleteVent(navigate, ventID);
                    });
                  }}
                  editFunction={() => {
                    navigate("/vent-to-strangers?" + vent.id);
                  }}
                  objectID={vent.id}
                  objectUserID={vent.userID}
                  reportFunction={(option) => {
                    import("./util").then((functions) => {
                      functions.reportVent(option, user.uid, vent.id);
                    });
                  }}
                  userID={user.uid}
                />
              )}
            </Container>

            {vent.new_tags && vent.new_tags.length > 0 && (
              <Container className="wrap gap8">
                {vent.new_tags.map((tag, index) => (
                  <Tag key={index} tag={tag} />
                ))}
              </Container>
            )}
          </Container>
          <SmartLink
            className={
              "main-container column border-bottom py16 px32 " +
              (disablePostOnClick ? "" : "clickable")
            }
            disablePostOnClick={disablePostOnClick}
            to={vent && vent.title && vent.id ? partialLink : ""}
          >
            {setTitle && <h1 className="fs-20 primary mb8">{vent.title}</h1>}
            {!setTitle && <h6 className="fs-20 primary mb8">{vent.title}</h6>}

            <p
              className="fw-400 grey-1 description"
              style={{
                WebkitLineClamp: displayCommentField ? 150 : 3,
                lineClamp: displayCommentField ? 150 : 3,
              }}
            >
              {ventPreview}
            </p>
            <Container className="x-fill align-center justify-end">
              <FontAwesomeIcon className="grey-5 mr8" icon={faClock} />
              <p className="grey-5 fs-16">
                {moment(vent.server_timestamp).fromNow()}
              </p>
            </Container>
          </SmartLink>

          {!searchPreviewMode && (
            <Container
              className={
                "relative justify-between wrap py16 px32 gap8 " +
                (!searchPreviewMode && displayCommentField
                  ? "border-bottom"
                  : "")
              }
            >
              <Container className="align-center gap16">
                <Container className="align-center gap4">
                  <img
                    alt="Support"
                    className={`clickable heart ${hasLiked ? "red" : "grey-5"}`}
                    onClick={(e) => {
                      e.preventDefault();

                      if (signUpProgressFunction) signUpProgressFunction();
                      import("./util").then((functions) => {
                        functions.likeOrUnlikeVent(
                          hasLiked,
                          setHasLiked,
                          setVent,
                          user,
                          vent
                        );
                      });
                    }}
                    src={
                      hasLiked
                        ? "/svgs/support-active.svg"
                        : "/svgs/support.svg"
                    }
                    style={{ height: "32px", width: "32px" }}
                    title="Give Support :)"
                  />
                  <p className="grey-5">
                    {vent.like_counter ? vent.like_counter : 0}
                  </p>
                </Container>

                <SmartLink
                  className="flex align-center gap4"
                  disablePostOnClick={disablePostOnClick}
                  to={vent && vent.title && vent.id ? partialLink : ""}
                >
                  <FontAwesomeIcon
                    className="clickable blue"
                    icon={faComments}
                    onClick={() => {
                      if (disablePostOnClick) textInput.current.focus();
                    }}
                    size="2x"
                  />
                  <p className="grey-5">
                    {vent.comment_counter ? vent.comment_counter : 0}
                  </p>
                </SmartLink>
              </Container>

              {(!user || (user && user.uid !== vent.userID && author.id)) && (
                <Container
                  className="button-2 wrap px16 py8 br8"
                  onClick={() => {
                    if (signUpProgressFunction) signUpProgressFunction();

                    import("./util").then((functions) => {
                      functions.startConversation(navigate, user, vent.userID);
                    });
                  }}
                >
                  <FontAwesomeIcon className="mr8" icon={faComments} />
                  <p className="ic ellipsis">
                    Message {capitolizeFirstChar(author.displayName)}
                  </p>
                </Container>
              )}
            </Container>
          )}

          {!searchPreviewMode && displayCommentField && comments && (
            <Container className="column gap16">
              {vent.comment_counter > 0 && (
                <Container className="border-bottom px32 py16">
                  <Dropdown
                    overlay={
                      <Container className="column bg-white shadow-2 pa8 br8">
                        <p
                          className="button-4 py8"
                          onClick={() => {
                            setActiveSort("First");

                            import("./util").then((functions) => {
                              functions.getVentComments(
                                "First",
                                [],
                                isMounted,
                                setCanLoadMoreComments,
                                setComments,
                                false,
                                ventID ? ventID : vent.id
                              );
                            });
                          }}
                        >
                          First
                        </p>
                        <p
                          className="button-4 py8"
                          onClick={() => {
                            setActiveSort("Best");

                            import("./util").then((functions) => {
                              functions.getVentComments(
                                "Best",
                                [],
                                isMounted,
                                setCanLoadMoreComments,
                                setComments,
                                false,
                                ventID ? ventID : vent.id
                              );
                            });
                          }}
                        >
                          Best
                        </p>
                        <p
                          className="button-4 py8"
                          onClick={() => {
                            setActiveSort("Last");

                            import("./util").then((functions) => {
                              functions.getVentComments(
                                "Last",
                                [],
                                isMounted,
                                setCanLoadMoreComments,
                                setComments,
                                false,
                                ventID ? ventID : vent.id
                              );
                            });
                          }}
                        >
                          Last
                        </p>
                      </Container>
                    }
                    trigger={["click"]}
                  >
                    <button className="blue">Sort By: {activeSort}</button>
                  </Dropdown>
                </Container>
              )}
              {comments && comments.length > 0 && (
                <Container className="column px32 pb16">
                  {comments.map((comment, index) => {
                    return (
                      <Comment
                        arrayLength={comments.length}
                        commentID={comment.id}
                        commentIndex={index}
                        comment2={comment}
                        setComments={setComments}
                        ventUserID={vent.userID}
                        key={comment.id}
                      />
                    );
                  })}
                  {canLoadMoreComments && (
                    <button
                      className="blue underline"
                      onClick={() => {
                        import("./util").then((functions) => {
                          functions.getVentComments(
                            activeSort,
                            comments,
                            isMounted,
                            setCanLoadMoreComments,
                            setComments,
                            true,
                            vent.id
                          );
                        });
                      }}
                      key={comments.length}
                    >
                      Load More Comments
                    </button>
                  )}
                </Container>
              )}
              {vent.comment_counter === 0 &&
                (!comments || (comments && comments.length === 0)) && (
                  <p className="tac px32 py16">
                    There are no comments yet. Please help this person :)
                  </p>
                )}
            </Container>
          )}
          {displayCommentField && !comments && (
            <Container className="x-fill full-center">
              <LoadingHeart />
            </Container>
          )}

          {!searchPreviewMode && displayCommentField && (
            <Container
              className="sticky column x-fill bg-white border-top shadow-2 br8 pa16"
              style={{ bottom: 0 }}
            >
              {isUserAccountNew && (
                <Link to="/rules">
                  <button className="blue ml8 mb8" size="large" type="link">
                    Read Our VWS Rules
                  </button>
                </Link>
              )}
              <Container className="flex-fill align-center gap8">
                <Container className="relative column flex-fill">
                  <MentionsInput
                    className="mentions"
                    onChange={(e) => {
                      if (isUserKarmaSufficientFunction)
                        return isUserKarmaSufficientFunction();

                      setCommentString(e.target.value);
                    }}
                    placeholder="Say something nice :)"
                    inputRef={textInput}
                    value={commentString}
                  >
                    <Mention
                      className="mentions__mention"
                      data={(currentTypingTag, callback) => {
                        import("./util").then((functions) => {
                          functions.findPossibleUsersToTag(
                            currentTypingTag,
                            vent.id,
                            callback
                          );
                        });
                      }}
                      markup="@[__display__](__id__)"
                      renderSuggestion={(
                        entry,
                        search,
                        highlightedDisplay,
                        index,
                        focused
                      ) => {
                        return (
                          <Container className="flex-fill align-center pa8 gap8">
                            <MakeAvatar
                              displayName={entry.displayName}
                              userBasicInfo={entry}
                            />
                            <Container className="button-7">
                              <h5 className="ellipsis fw-400 mr8">
                                {capitolizeFirstChar(entry.displayName)}
                              </h5>
                            </Container>
                            <KarmaBadge userBasicInfo={entry} noOnClick />
                          </Container>
                        );
                      }}
                      trigger="@"
                    />
                  </MentionsInput>
                </Container>
                <Button
                  onClick={async () => {
                    if (signUpProgressFunction) signUpProgressFunction();

                    if (!commentString) return;
                    import("./util").then((functions) => {
                      functions.commentVent(
                        commentString,
                        setVent,
                        user,
                        vent,
                        vent.id
                      );
                    });

                    setCommentString("");
                  }}
                  size="large"
                  type="primary"
                >
                  Send
                </Button>
              </Container>
            </Container>
          )}
        </Container>
      )}

      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their vents or comments. Are you sure you would like to block this user?"
          submit={() => {
            import("../../util").then((functions) => {
              functions.blockUser(user.uid, vent.userID);
            });
          }}
          title="Block User"
        />
      )}
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Container>
  );
}

function Tag({ tag }) {
  const [viewTag, setViewTag] = useState();

  useEffect(() => {
    import("../../util").then((functions) => {
      setViewTag(functions.viewTag(tag));
    });
  });
  return (
    <Link
      className="button-4 fs-16"
      key={tag}
      onClick={(e) => e.stopPropagation()}
      to={"/tags/" + tag}
    >
      {viewTag}
    </Link>
  );
}
export default Vent;
