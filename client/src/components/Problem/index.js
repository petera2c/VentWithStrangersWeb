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

import { addTagsToPage, capitolizeFirstChar } from "../../util";
import {
  commentProblem,
  getProblemComments,
  likeProblem,
  reportProblem,
  unlikeProblem
} from "./util";

class Problem extends Component {
  state = {
    comments: undefined,
    commentString: "",
    displayCommentField: this.props.displayCommentField,
    postOptions: false,
    reportModal: false
  };

  componentDidMount() {
    this.ismounted = true;
    const { displayCommentField } = this.props;
    const { problem, problemIndex } = this.props; // Variables

    if (displayCommentField)
      getProblemComments(this.context, problem, problemIndex);
  }
  componentWillUnmount() {
    this.ismounted = false;
  }
  handleChange = stateObj => {
    if (this.ismounted) this.setState(stateObj);
  };

  render() {
    const {
      commentString,
      displayCommentField,
      postOptions,
      reportModal
    } = this.state;
    const { history } = this.props; // Functions
    const {
      disablePostOnClick,
      previewMode,
      problem,
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
        <Link
          className={
            "x-fill column bg-white border-all2 mb8 br8 " +
            (disablePostOnClick ? "" : "clickable")
          }
          to={
            "/problem/" +
            problem._id +
            "/" +
            problem.title
              .replace(/[^a-zA-Z ]/g, "")
              .replace(/ /g, "-")
              .toLowerCase()
          }
          onClick={e => (disablePostOnClick ? e.preventDefault() : {})}
        >
          <Container className="x-fill justify-between border-bottom py16 pl32 pr16">
            <Link
              className="mr16"
              onClick={e => e.stopPropagation()}
              to={"/activity?" + problem.authorID}
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
            </Link>
            <Container className="relative flex-fill align-center justify-end">
              <Container className="flex-fill wrap justify-end">
                {problem.tags.map((tag, index) => (
                  <Text
                    className="button-1 clickable mr8"
                    key={index}
                    onClick={e => {
                      e.stopPropagation();
                      addTagsToPage(this.props, [tag]);
                    }}
                    text={tag.name}
                    type="p"
                  />
                ))}
              </Container>
              <FontAwesomeIcon
                className="grey-9 px16"
                icon={faEllipsisV}
                onClick={e => {
                  e.stopPropagation();
                  this.handleChange({ postOptions: !postOptions });
                }}
              />
              <HandleOutsideClick
                close={() => this.handleChange({ postOptions: false })}
                onClick={e => {
                  e.stopPropagation();
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
          </Container>
          <Container className="column border-bottom py16 px32">
            <Text className="fs-20 primary mb8" text={title} type="h1" />

            <Text
              className="fs-18 fw-400 grey-1"
              text={description}
              type="h2"
            />
          </Container>
          {!searchPreviewMode && (
            <Container className="wrap justify-between py16 px32">
              <Container className="align-center">
                <FontAwesomeIcon
                  className="clickable blue mr4"
                  icon={faComment}
                  onClick={e => {
                    e.stopPropagation();
                    this.handleChange({
                      displayCommentField: !displayCommentField
                    });
                    if (!displayCommentField)
                      getProblemComments(this.context, problem, problemIndex);
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
                    e.stopPropagation();
                    if (problem.hasLiked)
                      unlikeProblem(this.context, problem, problemIndex);
                    else likeProblem(this.context, problem, problemIndex);
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
        </Link>
        {!searchPreviewMode && displayCommentField && (
          <Container className="column bg-white border-all2 py16 mb16 ml8 br8">
            <Container className="border-bottom pb16 mb16">
              <Container className="align-center border-left active large px16">
                <FontAwesomeIcon className="blue mr8" icon={faComment} />
                <Text
                  className="blue fw-300"
                  text="Give your advice or supporting message"
                  type="h6"
                />
              </Container>
            </Container>
            <Container className="x-fill px16">
              <Container className="column x-fill align-end border-all pa8 br8">
                <TextArea
                  className="x-fill no-border no-resize"
                  onChange={e =>
                    this.handleChange({ commentString: e.target.value })
                  }
                  placeholder="Type a helpful message here..."
                  style={{ minHeight: "100px" }}
                  value={commentString}
                />
                <Button
                  className="button-2 px32 py8 br4"
                  onClick={() => {
                    commentProblem(
                      commentString,
                      this.context,
                      problem,
                      problemIndex
                    );
                    this.handleChange({ commentString: "" });
                  }}
                  text="Send"
                />
              </Container>
            </Container>
          </Container>
        )}
        {displayCommentField && problem.commentsArray && (
          <Container className="column pl16 mb16">
            <Container className="column border-all2 br8">
              {problem.commentsArray.map((comment, index) => (
                <Comment
                  arrayLength={problem.commentsArray.length}
                  comment={comment}
                  key={index}
                  index={index}
                />
              ))}
            </Container>
          </Container>
        )}
        {displayCommentField && !problem.commentsArray && (
          <Container className="x-fill full-center">
            <LoadingHeart />
          </Container>
        )}
        {reportModal && (
          <ReportModal
            close={() => this.handleChange({ reportModal: false })}
            submit={option =>
              reportProblem(this.context, problem._id, option, problemIndex)
            }
          />
        )}
      </Container>
    );
  }
}

Problem.contextType = ExtraContext;

export default withRouter(Problem);
