import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { withRouter } from "react-router-dom";
import TextArea from "react-textarea-autosize";
import ContentEditable from "react-contenteditable";
import { Editor } from "@tinymce/tinymce-react";
import { MentionsInput, Mention } from "react-mentions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/pro-regular-svg-icons/faCopy";
import { faClock } from "@fortawesome/pro-regular-svg-icons/faClock";
import { faShare } from "@fortawesome/pro-regular-svg-icons/faShare";
import { faHeart } from "@fortawesome/pro-regular-svg-icons/faHeart";
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
  WhatsappIcon,
} from "react-share";

import LoadingHeart from "../loaders/Heart";
import Comment from "../Comment";
import ReportModal from "../modals/Report";
import ConfirmAlertModal from "../modals/ConfirmAlert";
import SuccessMessage from "../SuccessMessage";

import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import Button from "../views/Button";
import Text from "../views/Text";

import { ExtraContext } from "../../context";

import {
  addTagsToPage,
  capitolizeFirstChar,
  isMobileOrTablet,
} from "../../util";
import {
  commentVent,
  commentLikeUpdate,
  deleteVent,
  findPossibleUsersToTag,
  getCurrentTypingIndex,
  getVentComments,
  likeVent,
  reportVent,
  tagUser,
  unlikeVent,
} from "./util";

import classNames from "./style.css";

const SmartLink = (props) => {
  const { children, className, disablePostOnClick, to } = props;
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

class Vent extends Component {
  state = {
    comments: undefined,
    commentString: "",
    currentTypingIndex: 0,
    deleteVentConfirm: false,
    displayCommentField: this.props.displayCommentField,
    possibleUsersToTag: undefined,
    postOptions: false,
    reportModal: false,
    shareClicked: false,
    taggedUsers: [],
    vent: this.props.vent,
  };

  componentDidMount() {
    this.ismounted = true;
    const { socket } = this.context;
    const { displayCommentField, ventIndex } = this.props; // Variables
    let { vent } = this.state;

    if (displayCommentField)
      getVentComments(this.context, this.handleChange, vent, ventIndex);

    socket.on(vent._id + "_like", (obj) => this.updateVentLikes(obj));
    socket.on(vent._id + "_unlike", (obj) => this.updateVentLikes(obj));

    socket.on(vent._id + "_comment", (obj) => this.addComment(obj));
    socket.on(vent._id + "_comment_like", (dataObj) =>
      commentLikeUpdate(
        this.state.comments,
        this.context,
        dataObj,
        this.updateCommentLikes
      )
    );
    socket.on(vent._id + "_comment_unlike", (dataObj) =>
      commentLikeUpdate(
        this.state.comments,
        this.context,
        dataObj,
        this.updateCommentLikes
      )
    );
    socket.on(vent._id + "_comment_edited", (savedComment) =>
      this.updateEditedComment(savedComment)
    );
  }
  componentWillUnmount() {
    this.ismounted = false;
  }
  handleChange = (stateObj, callback) => {
    if (this.ismounted) this.setState(stateObj, callback);
  };

  addComment = (returnObj) => {
    let { comments, vent } = this.state;
    let { comment, commentsSize } = returnObj;
    if (comment.hasLiked === undefined) comment.hasLiked = false;

    if (!comments) comments = [];
    comments.unshift(comment);
    vent.commentsSize = commentsSize;

    this.handleChange({ comments, vent });
  };

  updateEditedComment = (savedComment) => {
    let { comments } = this.state;

    for (let index in comments) {
      const comment = comments[index];

      if (comment._id === savedComment._id) {
        comments[index].text = savedComment.text;
      }
    }

    this.handleChange({ comments });
  };

  updateVentLikes = (updatetObj) => {
    let { vent } = this.state;

    vent.upVotes = updatetObj.upVotes;
    vent.dailyUpvotes = updatetObj.dailyUpvotes;
    if (updatetObj.hasLiked !== undefined) vent.hasLiked = updatetObj.hasLiked;

    this.handleChange({ vent });
  };

  updateCommentLikes = (commentIndex, updatetObj) => {
    const { comments } = this.state;
    let comment = comments[commentIndex];

    comment.upVotes = updatetObj.comment.upVotes;
    if (updatetObj.comment.hasLiked !== undefined)
      comment.hasLiked = updatetObj.comment.hasLiked;

    this.handleChange({ comments });
  };

  updateCommentString = (currentTypingIndex, newString) => {
    let { taggedUsers } = this.state;

    for (let index in taggedUsers) {
    }

    this.handleChange({ commentString: newString });
  };

  copyToClipboard = (e) => {
    this.textArea.select();
    document.execCommand("copy");
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    this.setState({ copySuccess: "Copied!" });
    var tooltip = document.getElementById("copy-message");
    tooltip.innerHTML = "Copied!";
  };

  removeComment = (commentIndex) => {
    let { comments } = this.state;

    comments.splice(commentIndex, 1);

    this.setState({ comments });
  };

  render() {
    const { handleChange, removeVent, socket } = this.context;
    const {
      comments,
      commentString,
      currentTypingIndex,
      deleteVentConfirm,
      displayCommentField,
      possibleUsersToTag,
      postOptions,
      reportModal,
      shareClicked,
      taggedUsers,
      vent,
    } = this.state;
    const { history, location } = this.props; // Functions
    const { pathname } = location;
    const {
      disablePostOnClick,
      isOnSingleVentPage,
      previewMode,
      ventIndex,
      searchPreviewMode,
    } = this.props; // Variables

    let keywords = "";
    for (let index in vent.tags) {
      if (index !== 0) keywords += ",";
      keywords += vent.tags[index];
    }

    let title = vent.title;

    let description = vent.description;
    if (previewMode && description.length > 240)
      description = description.slice(0, 240) + "... Read More";

    const partialLink =
      "/problem/" +
      vent._id +
      "/" +
      vent.title
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/ /g, "-")
        .toLowerCase();

    const fullLink = "https://www.ventwithstrangers.com" + partialLink;

    return (
      <Container className="x-fill column mb16">
        <Container className="x-fill column bg-white border-all2 mb8 br8">
          <SmartLink
            className={
              "main-container x-fill wrap justify-between border-bottom py16 pl32 pr16 " +
              (disablePostOnClick ? "" : "clickable")
            }
            disablePostOnClick={disablePostOnClick}
            to={partialLink}
          >
            <Container
              className="mr16"
              onClick={(e) => {
                e.preventDefault();

                history.push("/activity?" + vent.authorID);
              }}
            >
              <Container className="full-center">
                <Text
                  className="round-icon bg-blue white mr8"
                  text={capitolizeFirstChar(vent.author[0])}
                  type="h6"
                />
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
                    onClick={(e) => {
                      e.preventDefault();

                      addTagsToPage(this.props, [tag]);
                    }}
                    text={tag.name}
                    type="p"
                  />
                ))}
              </Container>

              <HandleOutsideClick
                close={() => this.handleChange({ postOptions: false })}
              >
                <FontAwesomeIcon
                  className="clickable grey-9 px16"
                  icon={faEllipsisV}
                  onClick={(e) => {
                    e.preventDefault();

                    this.handleChange({ postOptions: !postOptions });
                  }}
                />
                {postOptions && (
                  <div
                    className="absolute flex right-0"
                    style={{
                      top: "calc(100% + 8px)",
                      whiteSpace: "nowrap",
                      zIndex: 1,
                    }}
                  >
                    <Container className="column x-fill bg-white border-all2 border-all px16 py8 br8">
                      {vent.wasCreatedByUser && (
                        <Container
                          className="button-8 clickable align-center mb8"
                          onClick={(e) => {
                            e.preventDefault();
                            history.push({
                              pathname: "/post-a-problem",
                              state: { vent },
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
                          onClick={(e) => {
                            e.preventDefault();
                            this.handleChange({
                              deleteVentConfirm: true,
                              postOptions: false,
                            });
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
                          onClick={(e) => {
                            e.preventDefault();
                            this.handleChange({ reportModal: !reportModal });
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
            to={partialLink}
          >
            <Text className="fs-20 primary mb8" text={title} type="h1" />

            <Text
              className="fs-18 fw-400 grey-1"
              style={{ whiteSpace: "pre-line" }}
              text={description}
              type="p"
            />
          </SmartLink>
          {!searchPreviewMode && (
            <Container
              className={
                "relative wrap justify-between pt16 px32 " +
                (!searchPreviewMode && displayCommentField
                  ? "border-bottom"
                  : "")
              }
            >
              <Container className="align-center wrap">
                <Container className="align-center mb16">
                  <FontAwesomeIcon
                    className="clickable blue mr4"
                    icon={faComment}
                    onClick={(e) => {
                      e.preventDefault();
                      this.handleChange({
                        displayCommentField: !displayCommentField,
                      });
                      if (!displayCommentField)
                        getVentComments(
                          this.context,
                          this.handleChange,
                          vent,
                          ventIndex
                        );
                    }}
                    size="2x"
                    title="Comment"
                  />
                  <Text
                    className="blue mr8"
                    text={vent.commentsSize}
                    type="p"
                  />
                  <img
                    className={`clickable heart ${
                      vent.hasLiked ? "red" : "grey-5"
                    } mr4`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (vent.hasLiked)
                        unlikeVent(this.context, vent, this.updateVentLikes);
                      else likeVent(this.context, vent, this.updateVentLikes);
                    }}
                    src={
                      vent.hasLiked
                        ? require("../../svgs/support-active.svg")
                        : require("../../svgs/support.svg")
                    }
                    style={{ height: "32px" }}
                    title="Give Support :)"
                  />

                  <Text className="grey-5 mr16" text={vent.upVotes} type="p" />
                </Container>

                <Container className="mb16">
                  <HandleOutsideClick
                    close={() => this.handleChange({ shareClicked: false })}
                  >
                    <Button
                      className="button-2 px16 py8 mr16 br8"
                      onClick={() =>
                        this.handleChange({ shareClicked: !shareClicked })
                      }
                    >
                      <FontAwesomeIcon className="mr8" icon={faShare} />
                      Share
                    </Button>
                    {false && (
                      <Button
                        className="button-2 px16 py8 br8"
                        onClick={() => {
                          socket.emit(
                            "create_new_conversation",
                            vent._id,
                            (stateObj) => {
                              this.handleChange(stateObj, this.onFocus);
                            }
                          );
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
                          zIndex: 1,
                        }}
                      >
                        <Container className="wrap mb8">
                          <FacebookShareButton
                            className="mr8"
                            url={fullLink}
                            quote=""
                          >
                            <FacebookIcon round={true} size={32} />
                          </FacebookShareButton>
                          <TwitterShareButton
                            className="mr8"
                            title=""
                            url={fullLink}
                          >
                            <TwitterIcon round={true} size={32} />
                          </TwitterShareButton>
                          <RedditShareButton
                            className="mr8"
                            title=""
                            url={fullLink}
                          >
                            <RedditIcon round={true} size={32} />
                          </RedditShareButton>
                          <PinterestShareButton
                            className="mr8"
                            description=""
                            url={fullLink}
                          >
                            <PinterestIcon round={true} size={32} />
                          </PinterestShareButton>
                          <TumblrShareButton
                            caption=""
                            className="mr8"
                            title=""
                            url={fullLink}
                          >
                            <TumblrIcon round={true} size={32} />
                          </TumblrShareButton>
                          <WhatsappShareButton
                            className="mr8"
                            title=""
                            url={fullLink}
                          >
                            <WhatsappIcon round={true} size={32} />
                          </WhatsappShareButton>
                          <TelegramShareButton
                            className="mr8"
                            title=""
                            url={fullLink}
                          >
                            <TelegramIcon round={true} size={32} />
                          </TelegramShareButton>
                          <EmailShareButton
                            body=""
                            className="mr8"
                            subject=""
                            url={fullLink}
                          >
                            <EmailIcon round={true} size={32} />
                          </EmailShareButton>
                        </Container>
                        <Container className="relative">
                          <Container
                            className="success-message-button button-2 round-icon mr8"
                            onClick={this.copyToClipboard}
                          >
                            <FontAwesomeIcon className="" icon={faCopy} />
                            <SuccessMessage
                              id="copy-message"
                              text="Copy Link"
                            />
                          </Container>
                          <input
                            className="br4"
                            onChange={() => {}}
                            ref={(textarea) => (this.textArea = textarea)}
                            value={fullLink}
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
                  text={moment(vent.createdAt).subtract(1, "minute").fromNow()}
                  type="p"
                />
              </Container>
            </Container>
          )}
          {!searchPreviewMode && displayCommentField && (
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
                        onChange={(e) => {
                          this.handleChange({ commentString: e.target.value });
                        }}
                        value={commentString}
                      >
                        <Mention
                          className="mentions__mention"
                          data={(currentTypingTag, callback) => {
                            findPossibleUsersToTag(
                              this.handleChange,
                              currentTypingTag,
                              socket,
                              vent._id,
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
                      onClick={() => {
                        commentVent(
                          this.addComment,
                          commentString,
                          this.context,
                          vent._id
                        );
                        this.handleChange({ commentString: "" });
                      }}
                      text="Send"
                    />
                  </Container>
                </Container>
              </Container>
            </Container>
          )}
          {displayCommentField && comments && (
            <Container className="column mb16">
              <Container className="column border-all2 br8">
                {comments.map((comment, index) => (
                  <Comment
                    arrayLength={comments.length}
                    comment={comment}
                    commentIndex={index}
                    key={index + comment._id}
                    removeComment={this.removeComment}
                  />
                ))}
              </Container>
            </Container>
          )}
          {displayCommentField && !comments && (
            <Container className="x-fill full-center">
              <LoadingHeart />
            </Container>
          )}
        </Container>

        {reportModal && (
          <ReportModal
            close={() => this.handleChange({ reportModal: false })}
            submit={(option) =>
              reportVent(
                this.context,
                history,
                vent._id,
                option,
                pathname,
                ventIndex
              )
            }
          />
        )}
        {deleteVentConfirm && (
          <ConfirmAlertModal
            close={() => this.handleChange({ deleteVentConfirm: false })}
            message="Are you sure you would like to delete this vent?"
            submit={() =>
              deleteVent(
                history,
                isOnSingleVentPage,
                removeVent,
                socket,
                vent._id,
                ventIndex
              )
            }
            title="Delete Vent"
          />
        )}
      </Container>
    );
  }
}

Vent.contextType = ExtraContext;

export default withRouter(Vent);
