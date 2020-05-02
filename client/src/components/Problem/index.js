import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { withRouter } from "react-router-dom";
import TextArea from "react-textarea-autosize";

import { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/pro-regular-svg-icons/faClock";
import { faHeart } from "@fortawesome/pro-regular-svg-icons/faHeart";
import { faHeart as faHeart2 } from "@fortawesome/pro-solid-svg-icons/faHeart";
import { faComment } from "@fortawesome/pro-regular-svg-icons/faComment";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faEdit } from "@fortawesome/pro-light-svg-icons/faEdit";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons/faExclamationTriangle";

import LoadingHeart from "../loaders/Heart";
import Comment from "../Comment";
import ReportModal from "../modals/Report";

import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import Button from "../views/Button";
import Text from "../views/Text";

import {
  addTagsToPage,
  capitolizeFirstChar,
  isMobileOrTablet
} from "../../util";
import {
  commentProblem,
  getProblemComments,
  likeProblem,
  reportProblem,
  unlikeProblem
} from "./util";

class SmartLink extends Component {
  render() {
    const { children, className, disablePostOnClick, to } = this.props;

    if (disablePostOnClick) {
      return <Container className={className}>{children}</Container>;
    } else {
      return (
        <Link className={className} to={to}>
          {children}
        </Link>
      );
    }
  }
}

class Problem extends Component {
  state = {
    comments: undefined,
    commentString: "",
    displayCommentField: this.props.displayCommentField,
    postOptions: false,
    reportModal: false,
    problem: this.props.problem
  };

  componentDidMount() {
    this.ismounted = true;
    const { socket } = this.context;
    const { displayCommentField, problemIndex } = this.props; // Variables
    let { problem } = this.state;

    if (displayCommentField)
      getProblemComments(
        this.context,
        this.handleChange,
        problem,
        problemIndex
      );

    socket.on(problem._id + "_like", obj => this.updateProblemLikes(obj));
    socket.on(problem._id + "_unlike", obj => this.updateProblemLikes(obj));

    socket.on(problem._id + "_comment", obj => this.addComment(obj));
    socket.on(problem._id + "_comment_like", obj => {
      const { comments } = this.state;
      if (comments) {
        const { comment } = obj;
        const commentIndex = comments.findIndex(
          commentObj => commentObj._id === comment._id
        );
        this.updateCommentLikes(commentIndex, obj);
      }
    });
    socket.on(problem._id + "_comment_unlike", obj => {
      const { comments } = this.state;
      if (comments) {
        const { comment } = obj;
        const commentIndex = comments.findIndex(
          commentObj => commentObj._id === comment._id
        );
        this.updateCommentLikes(commentIndex, obj);
      }
    });
  }
  componentWillUnmount() {
    this.ismounted = false;
  }
  handleChange = stateObj => {
    if (this.ismounted) this.setState(stateObj);
  };

  addComment = returnObj => {
    let { comments, problem } = this.state;
    let { comment } = returnObj;
    if (comment.hasLiked === undefined) comment.hasLiked = false;

    if (!comments) comments = [];
    comments.unshift(comment);
    problem.commentsSize += 1;

    this.handleChange({ comments, problem });
  };

  updateProblemLikes = updatetObj => {
    let { problem } = this.state;

    problem.upVotes = updatetObj.upVotes;
    problem.dailyUpvotes = updatetObj.dailyUpvotes;
    if (updatetObj.hasLiked !== undefined)
      problem.hasLiked = updatetObj.hasLiked;

    this.setState({ problem });
  };

  updateCommentLikes = (commentIndex, updatetObj) => {
    const { comments } = this.state;
    let comment = comments[commentIndex];

    comment.upVotes = updatetObj.comment.upVotes;
    if (updatetObj.comment.hasLiked !== undefined)
      comment.hasLiked = updatetObj.comment.hasLiked;

    this.setState({ comments });
  };

  render() {
    const {
      comments,
      commentString,
      displayCommentField,
      postOptions,
      reportModal,
      problem
    } = this.state;
    const { history, location } = this.props; // Functions
    const { pathname } = location;
    const {
      disablePostOnClick,
      previewMode,
      problemIndex,
      searchPreviewMode
    } = this.props; // Variables

    let keywords = "";
    for (let index in problem.tags) {
      if (index !== 0) keywords += ",";
      keywords += problem.tags[index];
    }

    let title = problem.title;

    let description = problem.description;
    if (previewMode && description.length > 240)
      description = description.slice(0, 240) + "... Read More";

    return (
      <Container className="x-fill column mb16">
        <Container className="x-fill column bg-white border-all2 mb8 br8">
          <SmartLink
            className={
              "main-container x-fill wrap justify-between border-bottom py16 pl32 pr16 " +
              (disablePostOnClick ? "" : "clickable")
            }
            disablePostOnClick={disablePostOnClick}
            to={
              "/problem/" +
              problem._id +
              "/" +
              problem.title
                .replace(/[^a-zA-Z ]/g, "")
                .replace(/ /g, "-")
                .toLowerCase()
            }
          >
            <Container
              className="mr16"
              onClick={e => {
                e.preventDefault();

                history.push("/activity?" + problem.authorID);
              }}
            >
              <Container className="full-center">
                <Text
                  className="round-icon bg-blue white mr8"
                  text={capitolizeFirstChar(problem.author[0])}
                  type="h6"
                />
                <Text
                  className="button-1 fw-400"
                  text={capitolizeFirstChar(problem.author)}
                  type="h5"
                />
              </Container>
            </Container>
            <Container className="relative flex-fill align-center justify-end">
              <Container className="flex-fill wrap justify-end">
                {problem.tags.map((tag, index) => (
                  <Text
                    className="button-1 clickable mr8"
                    key={index}
                    onClick={e => {
                      e.preventDefault();

                      addTagsToPage(this.props, [tag]);
                    }}
                    text={tag.name}
                    type="p"
                  />
                ))}
              </Container>
              <FontAwesomeIcon
                className="clickable grey-9 px16"
                icon={faEllipsisV}
                onClick={e => {
                  e.preventDefault();

                  this.handleChange({ postOptions: !postOptions });
                }}
              />
              <HandleOutsideClick
                close={() => this.handleChange({ postOptions: false })}
                onClick={e => {
                  e.preventDefault();
                }}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  display: postOptions ? "" : "none",
                  zIndex: 1
                }}
              >
                <Container className="column x-fill bg-white border-all2 border-all px16 py8 br8">
                  {false && problem.wasCreatedByUser && (
                    <Container className="button-7 clickable align-center mb4">
                      <FontAwesomeIcon className="mr8" icon={faEdit} />
                      Edit Post
                    </Container>
                  )}
                  <Container
                    className="button-8 clickable align-center"
                    onClick={() => this.handleChange({ reportModal: true })}
                  >
                    <FontAwesomeIcon
                      className="mr8"
                      icon={faExclamationTriangle}
                    />
                    Report Post
                  </Container>
                </Container>
              </HandleOutsideClick>
            </Container>
          </SmartLink>
          <SmartLink
            className={
              "main-container column border-bottom py16 px32 " +
              (disablePostOnClick ? "" : "clickable")
            }
            disablePostOnClick={disablePostOnClick}
            to={
              "/problem/" +
              problem._id +
              "/" +
              problem.title
                .replace(/[^a-zA-Z ]/g, "")
                .replace(/ /g, "-")
                .toLowerCase()
            }
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
                "wrap justify-between py16 px32 " +
                (!searchPreviewMode && displayCommentField
                  ? "border-bottom"
                  : "")
              }
            >
              <Container className="align-center">
                <FontAwesomeIcon
                  className="clickable blue mr4"
                  icon={faComment}
                  onClick={e => {
                    e.preventDefault();
                    this.handleChange({
                      displayCommentField: !displayCommentField
                    });
                    if (!displayCommentField)
                      getProblemComments(
                        this.context,
                        this.handleChange,
                        problem,
                        problemIndex
                      );
                  }}
                />
                <Text
                  className="blue mr8"
                  text={problem.commentsSize}
                  type="p"
                />
                <FontAwesomeIcon
                  className={`clickable heart ${
                    problem.hasLiked ? "red" : "grey-5"
                  } mr4`}
                  icon={problem.hasLiked ? faHeart2 : faHeart}
                  onClick={e => {
                    e.preventDefault();
                    if (problem.hasLiked)
                      unlikeProblem(
                        this.context,
                        problem,
                        this.updateProblemLikes
                      );
                    else
                      likeProblem(
                        this.context,
                        problem,
                        this.updateProblemLikes
                      );
                  }}
                />
                <Text className="grey-5 mr16" text={problem.upVotes} type="p" />
              </Container>
              <Container className="align-center">
                <FontAwesomeIcon className="grey-5 mr8" icon={faClock} />
                <Text
                  className="grey-5"
                  text={moment(problem.createdAt)
                    .subtract(1, "minute")
                    .fromNow()}
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
                  <Container className="column x-fill align-end border-all pa8 br8">
                    <TextArea
                      className="x-fill no-border no-resize"
                      onChange={e =>
                        this.handleChange({ commentString: e.target.value })
                      }
                      placeholder="Type a helpful message here..."
                      style={{
                        minHeight: isMobileOrTablet() ? "100px" : "60px"
                      }}
                      value={commentString}
                    />
                    <Button
                      className="button-2 px32 py8 br4"
                      onClick={() => {
                        commentProblem(
                          commentString,
                          this.context,
                          problem,
                          this.addComment
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
                    key={index}
                    index={index}
                    updateCommentLikes={this.updateCommentLikes}
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
            submit={option =>
              reportProblem(
                this.context,
                history,
                problem._id,
                option,
                pathname,
                problemIndex
              )
            }
          />
        )}
      </Container>
    );
  }
}

Problem.contextType = ExtraContext;

export default withRouter(Problem);
