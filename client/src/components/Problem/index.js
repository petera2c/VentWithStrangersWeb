import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { withRouter } from "react-router-dom";
import TextArea from "react-textarea-autosize";

import { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons/faClock";
import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";
import { faHeart as faHeart2 } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faComment } from "@fortawesome/free-regular-svg-icons/faComment";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";

import LoadingHeart from "../loaders/Heart";
import Comment from "../Comment";

import Container from "../containers/Container";
import Button from "../views/Button";
import Text from "../views/Text";

import { addTagsToPage, capitolizeFirstChar } from "../../util";
import {
  commentProblem,
  getProblemComments,
  likeProblem,
  unlikeProblem
} from "./util";

class Problem extends Component {
  state = {
    comments: undefined,
    commentString: "",
    displayCommentField: this.props.displayCommentField
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
    const { commentString, displayCommentField } = this.state;
    const { history } = this.props; // Functions
    const { previewMode, problem, problemIndex } = this.props; // Variables

    let keywords = "";
    for (let index in problem.tags) {
      if (index !== 0) keywords += ",";
      keywords += problem.tags[index];
    }

    return (
      <Container className="justify-center align-start bg-grey">
        <Container className="x-fill column mb16">
          <Container className="x-fill column bg-white mb8 br8">
            <Container
              className="clickable border-bottom justify-between py16 pl32 pr16"
              onClick={() =>
                history.push("/problem/" + problem.title + "?" + problem._id)
              }
            >
              <Link
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
              <Container className="wrap align-center">
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
                <FontAwesomeIcon className="grey-9 ml16" icon={faEllipsisV} />
              </Container>
            </Container>
            <Container
              className={`column ${
                previewMode ? "" : "border-bottom"
              } py16 px32`}
            >
              <Text
                className="fw-400 grey-8 mb8"
                text={problem.title}
                type="h5"
              />
              <Container className="mb8">
                <FontAwesomeIcon className="grey-5 mr8" icon={faClock} />
                <Text
                  className="grey-5"
                  text={moment(problem.createdAt)
                    .subtract(1, "minute")
                    .fromNow()}
                  type="p"
                />
              </Container>
              <Text
                className=""
                text={
                  previewMode
                    ? problem.description.slice(0, 100)
                    : problem.description
                }
                type="p"
              />
            </Container>
            {!previewMode && (
              <Container className="py16 px32">
                <FontAwesomeIcon
                  className="clickable blue mr4"
                  icon={faComment}
                  onClick={e => {
                    e.stopPropagation();
                    this.handleChange({ displayCommentField: true });
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
                <Text className="grey-5" text={problem.upVotes} type="p" />
              </Container>
            )}
          </Container>
          {!previewMode && displayCommentField && (
            <Container className="column bg-white py16 mb16 br8">
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
              {problem.commentsArray.map((comment, index) => (
                <Comment
                  arrayLength={problem.commentsArray.length}
                  comment={comment}
                  key={index}
                  index={index}
                />
              ))}
            </Container>
          )}
          {displayCommentField && !problem.commentsArray && (
            <Container className="x-fill full-center">
              <LoadingHeart />
            </Container>
          )}
        </Container>
      </Container>
    );
  }
}

Problem.contextType = ExtraContext;

export default withRouter(Problem);
