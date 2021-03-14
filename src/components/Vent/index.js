import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import moment from "moment-timezone";
import { withRouter } from "react-router-dom";
import TextArea from "react-textarea-autosize";
import ContentEditable from "react-contenteditable";
import { Editor } from "@tinymce/tinymce-react";
import { MentionsInput, Mention } from "react-mentions";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/pro-regular-svg-icons/faCopy";
import { faClock } from "@fortawesome/pro-regular-svg-icons/faClock";
import { faShare } from "@fortawesome/pro-regular-svg-icons/faShare";
import { faHeart } from "@fortawesome/pro-light-svg-icons/faHeart";
import { faHeart as faHeart2 } from "@fortawesome/pro-solid-svg-icons/faHeart";
import { faComment } from "@fortawesome/pro-light-svg-icons/faComment";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faEdit } from "@fortawesome/pro-light-svg-icons/faEdit";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/pro-duotone-svg-icons/faTrash";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";

import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  PinterestIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  WhatsappIcon
} from "react-share";
import db from "../../config/firebase";

import LoadingHeart from "../loaders/Heart";
import Comment from "../Comment";
import ReportModal from "../modals/Report";
import ConfirmAlertModal from "../modals/ConfirmAlert";
import SuccessMessage from "../SuccessMessage";

import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import Button from "../views/Button";
import Text from "../views/Text";

import { UserContext } from "../../context";

import {
  addTagsToPage,
  capitolizeFirstChar,
  isMobileOrTablet
} from "../../util";
import {
  commentVent,
  deleteVent,
  findPossibleUsersToTag,
  getCurrentTypingIndex,
  getVentComments,
  getVentDescription,
  getVentFullLink,
  getVentPartialLink,
  likeOrUnlikeVent,
  newVentCommentListener,
  reportVent,
  startConversation,
  tagUser,
  ventHasLikedListener,
  ventListener
} from "./util";

import classNames from "./style.css";

const SmartLink = ({ children, className, disablePostOnClick, to }) => {
  if (disablePostOnClick) {
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
  displayCommentField,
  disablePostOnClick,
  isOnSingleVentPage,
  previewMode,
  searchPreviewMode,
  setDescription,
  setTitle,
  ventID
}) {
  const user = useContext(UserContext);

  const [vent, setVent] = useState();
  const [commentString, setCommentString] = useState("");
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [deleteVentConfirm, setDeleteVentConfirm] = useState(false);
  const [displayCommentField2, setDisplayCommentField] = useState(
    displayCommentField
  );
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState();

  const [possibleUsersToTag, setPossibleUsersToTag] = useState();
  const [postOptions, setPostOptions] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState([]);

  const [copySuccess, setCopySuccess] = useState("Copy Link");
  const textAreaRef = useRef(null);

  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;

  let newCommentListenerUnsubscribe;
  let ventHasLikedListenerUnsubscribe;

  useEffect(() => {
    const ventListenerUnsubscribe = ventListener(
      setDescription,
      setTitle,
      setVent,
      ventID
    );

    if (!searchPreviewMode && displayCommentField2)
      newCommentListenerUnsubscribe = newVentCommentListener(
        setComments,
        ventID
      );
    if (!searchPreviewMode) getVentComments(comments, setComments, ventID);

    if (user && !searchPreviewMode)
      ventHasLikedListenerUnsubscribe = ventHasLikedListener(
        setHasLiked,
        user.uid,
        ventID
      );

    return () => {
      ventListenerUnsubscribe();
      if (newCommentListenerUnsubscribe) newCommentListenerUnsubscribe();
      if (ventHasLikedListenerUnsubscribe) ventHasLikedListenerUnsubscribe();
    };
  }, []);
  const copyToClipboard = e => {
    textAreaRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    setCopySuccess("Copied!");
  };

  return (
    <Container className="x-fill column mb16">
      {vent && (
        <Container className="x-fill column bg-white border-all2 mb8 br8">
          <SmartLink
            className={
              "main-container x-fill wrap justify-between border-bottom py16 pl32 pr16 " +
              (disablePostOnClick ? "" : "clickable")
            }
            disablePostOnClick={disablePostOnClick}
            to={getVentPartialLink(vent)}
          >
            <Container
              className="mr16"
              onClick={e => {
                e.preventDefault();
                if (vent.authorID) history.push("/activity?" + vent.authorID);
              }}
            >
              <Container className="full-center">
                {vent.author && (
                  <Text
                    className="round-icon bg-blue white mr8"
                    text={capitolizeFirstChar(vent.author[0])}
                    type="h6"
                  />
                )}
                <Text
                  className="button-1 fw-400"
                  text={capitolizeFirstChar(vent.author)}
                  type="h5"
                />
              </Container>
            </Container>
            <Container className="relative flex-fill align-center justify-end">
              <Container className="flex-fill wrap justify-end">
                {vent.tags.map((tag, index) => (
                  <Text
                    className="button-1 clickable mr8"
                    key={index}
                    onClick={e => {
                      e.preventDefault();

                      addTagsToPage(props, [tag]);
                    }}
                    text={tag.name}
                    type="p"
                  />
                ))}
              </Container>

              <HandleOutsideClick close={() => setPostOptions(false)}>
                <FontAwesomeIcon
                  className="clickable grey-9 px16"
                  icon={faEllipsisV}
                  onClick={e => {
                    e.preventDefault();

                    setPostOptions(!postOptions);
                  }}
                />
                {postOptions && (
                  <div
                    className="absolute flex right-0"
                    style={{
                      top: "calc(100% + 8px)",
                      whiteSpace: "nowrap",
                      zIndex: 1
                    }}
                  >
                    <Container className="column x-fill bg-white border-all2 border-all px16 py8 br8">
                      {vent.wasCreatedByUser && (
                        <Container
                          className="button-8 clickable align-center mb8"
                          onClick={e => {
                            e.preventDefault();
                            history.push({
                              pathname: "/post-a-problem",
                              state: { vent }
                            });
                          }}
                        >
                          <Text
                            className="fw-400 flex-fill"
                            text="Edit Vent"
                            type="p"
                          />
                          <FontAwesomeIcon className="ml8" icon={faEdit} />
                        </Container>
                      )}
                      {vent.wasCreatedByUser && (
                        <Container
                          className="button-8 clickable align-center"
                          onClick={e => {
                            e.preventDefault();
                            setDeleteVentConfirm(true);
                            setPostOptions(false);
                          }}
                        >
                          <Text
                            className="fw-400 flex-fill"
                            text="Delete Vent"
                            type="p"
                          />
                          <FontAwesomeIcon className="ml8" icon={faTrash} />
                        </Container>
                      )}
                      {!vent.wasCreatedByUser && (
                        <Container
                          className="button-8 clickable align-center"
                          onClick={e => {
                            e.preventDefault();
                            setReportModal(!reportModal);
                          }}
                        >
                          <Text
                            className="fw-400 flex-fill"
                            text="Report Vent"
                            type="p"
                          />
                          <FontAwesomeIcon
                            className="ml8"
                            icon={faExclamationTriangle}
                          />
                        </Container>
                      )}
                    </Container>
                  </div>
                )}
              </HandleOutsideClick>
            </Container>
          </SmartLink>
          <SmartLink
            className={
              "main-container column border-bottom py16 px32 " +
              (disablePostOnClick ? "" : "clickable")
            }
            disablePostOnClick={disablePostOnClick}
            to={getVentPartialLink(vent)}
          >
            <Text className="fs-20 primary mb8" text={vent.title} type="h1" />

            <Text
              className="fs-18 fw-400 grey-1"
              style={{ whiteSpace: "pre-line" }}
              text={getVentDescription(previewMode, vent)}
              type="p"
            />
          </SmartLink>
          {!searchPreviewMode && (
            <Container
              className={
                "relative wrap justify-between pt16 px32 " +
                (!searchPreviewMode && displayCommentField2
                  ? "border-bottom"
                  : "")
              }
            >
              <Container className="align-center wrap">
                <Container className="align-center mb16">
                  <FontAwesomeIcon
                    className="clickable blue mr4"
                    icon={faComment}
                    onClick={e => {
                      e.preventDefault();
                      setDisplayCommentField(!displayCommentField2);

                      if (displayCommentField2 && newCommentListenerUnsubscribe)
                        newCommentListenerUnsubscribe();
                      if (!displayCommentField2)
                        newCommentListenerUnsubscribe = newVentCommentListener(
                          setComments,
                          vent.id
                        );
                    }}
                    size="2x"
                    title="Comment"
                  />
                  <Text
                    className="blue mr8"
                    text={vent.comment_counter ? vent.comment_counter : 0}
                    type="p"
                  />

                  <img
                    className={`clickable heart ${
                      hasLiked ? "red" : "grey-5"
                    } mr4`}
                    onClick={e => {
                      e.preventDefault();
                      likeOrUnlikeVent(hasLiked, user, vent);
                    }}
                    src={
                      hasLiked
                        ? require("../../svgs/support-active.svg")
                        : require("../../svgs/support.svg")
                    }
                    style={{ height: "32px" }}
                    title="Give Support :)"
                  />

                  <Text
                    className="grey-5 mr16"
                    text={vent.like_counter ? vent.like_counter : 0}
                    type="p"
                  />
                </Container>

                <Container className="mb16">
                  <HandleOutsideClick close={() => setShareClicked(false)}>
                    <Button
                      className="button-2 px16 py8 mr16 br8"
                      onClick={() => setShareClicked(!shareClicked)}
                    >
                      <FontAwesomeIcon className="mr8" icon={faShare} />
                      Share
                    </Button>
                    {(!user || (user && user.uid !== vent.userID)) && (
                      <Button
                        className="button-2 px16 py8 br8"
                        onClick={() => {
                          if (!user)
                            alert("You must make an account to message user!");
                          startConversation(history, user.uid, vent.userID);
                        }}
                      >
                        <FontAwesomeIcon className="mr8" icon={faComments} />
                        Message User
                      </Button>
                    )}

                    {shareClicked && (
                      <Container
                        className="absolute left-0 flex column bg-white shadow-2 px16 py16 br8"
                        style={{
                          top: "calc(100% - 8px)",
                          zIndex: 1
                        }}
                      >
                        <Container className="wrap mb8">
                          <FacebookShareButton
                            className="mr8"
                            url={getVentFullLink(vent)}
                            quote=""
                          >
                            <FacebookIcon round={true} size={32} />
                          </FacebookShareButton>
                          <TwitterShareButton
                            className="mr8"
                            title=""
                            url={getVentFullLink(vent)}
                          >
                            <TwitterIcon round={true} size={32} />
                          </TwitterShareButton>
                          <RedditShareButton
                            className="mr8"
                            title=""
                            url={getVentFullLink(vent)}
                          >
                            <RedditIcon round={true} size={32} />
                          </RedditShareButton>
                          <PinterestShareButton
                            className="mr8"
                            description=""
                            url={getVentFullLink(vent)}
                          >
                            <PinterestIcon round={true} size={32} />
                          </PinterestShareButton>
                          <TumblrShareButton
                            caption=""
                            className="mr8"
                            title=""
                            url={getVentFullLink(vent)}
                          >
                            <TumblrIcon round={true} size={32} />
                          </TumblrShareButton>
                          <WhatsappShareButton
                            className="mr8"
                            title=""
                            url={getVentFullLink(vent)}
                          >
                            <WhatsappIcon round={true} size={32} />
                          </WhatsappShareButton>
                          <TelegramShareButton
                            className="mr8"
                            title=""
                            url={getVentFullLink(vent)}
                          >
                            <TelegramIcon round={true} size={32} />
                          </TelegramShareButton>
                          <EmailShareButton
                            body=""
                            className="mr8"
                            subject=""
                            url={getVentFullLink(vent)}
                          >
                            <EmailIcon round={true} size={32} />
                          </EmailShareButton>
                        </Container>
                        <Container className="relative">
                          <Container
                            className="success-message-button button-2 round-icon mr8"
                            onClick={copyToClipboard}
                          >
                            <FontAwesomeIcon className="" icon={faCopy} />
                            <SuccessMessage
                              id="copy-message"
                              text={copySuccess}
                            />
                          </Container>
                          <input
                            className="br4"
                            onChange={() => {}}
                            ref={textAreaRef}
                            value={getVentFullLink(vent)}
                          />
                        </Container>
                      </Container>
                    )}
                  </HandleOutsideClick>
                </Container>
              </Container>
              <Container className="align-center mb16">
                <FontAwesomeIcon className="grey-5 mr8" icon={faClock} />
                <Text
                  className="grey-5"
                  text={moment(vent.server_timestamp)
                    .subtract(1, "minute")
                    .fromNow()}
                  type="p"
                />
              </Container>
            </Container>
          )}
          {!searchPreviewMode && displayCommentField2 && (
            <Container
              className={
                "x-fill " +
                (comments && comments.length > 0 ? "border-bottom" : "")
              }
            >
              <Container className="x-fill column border-all2 py16 br8">
                <Container className="x-fill px16">
                  <Container className="column x-fill align-end br8">
                    <Container className="relative x-fill">
                      <MentionsInput
                        className="mentions"
                        onChange={e => setCommentString(e.target.value)}
                        value={commentString}
                      >
                        <Mention
                          className="mentions__mention"
                          data={(currentTypingTag, callback) => {
                            findPossibleUsersToTag(
                              setPossibleUsersToTag,
                              currentTypingTag,
                              vent.id,
                              callback
                            );
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
                              <Container
                                className="button-7 column pa16"
                                key={entry.id}
                              >
                                <Text text={entry.display} type="h6" />
                              </Container>
                            );
                          }}
                          trigger="@"
                        />
                      </MentionsInput>
                    </Container>

                    <Button
                      className="button-2 px32 py8 mt8 br4"
                      onClick={async () => {
                        commentVent(commentString, user, vent.id);
                        setCommentString("");
                      }}
                      text="Send"
                    />
                  </Container>
                </Container>
              </Container>
            </Container>
          )}
          {!searchPreviewMode && displayCommentField2 && comments && (
            <Container className="column mb16">
              <Container className="column border-all2 br8">
                {comments.map((comment, index) => {
                  console.log(comment);
                  return (
                    <Comment
                      arrayLength={comments.length}
                      commentID={comment.id}
                      commentIndex={index}
                      comment={comment}
                      ventID={ventID}
                      key={index}
                    />
                  );
                })}
                {vent.comment_counter > comments.length && (
                  <Button
                    className="blue underline"
                    onClick={() => {
                      getVentComments(comments, setComments, ventID);
                    }}
                    key={comments.length}
                  >
                    Load More Comments
                  </Button>
                )}
              </Container>
            </Container>
          )}
          {displayCommentField2 && !comments && (
            <Container className="x-fill full-center">
              <LoadingHeart />
            </Container>
          )}
        </Container>
      )}

      {reportModal && (
        <ReportModal
          close={() => this.handleChange({ reportModal: false })}
          submit={option => reportVent(history, vent._id, option, pathname)}
        />
      )}
      {deleteVentConfirm && (
        <ConfirmAlertModal
          close={() => this.handleChange({ deleteVentConfirm: false })}
          message="Are you sure you would like to delete this vent?"
          submit={() => deleteVent(history, isOnSingleVentPage, vent.id)}
          title="Delete Vent"
        />
      )}
    </Container>
  );
}

export default Vent;
