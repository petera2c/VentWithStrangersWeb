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

import Container from "../containers/Container";
import Button from "../views/Button";
import Text from "../views/Text";

import { capitolizeFirstChar } from "../../util";
import { addTagsToPage } from "../../util";
import { commentProblem, getProblemComments, likeProblem } from "./util";

class Problem extends Component {
  state = {
    comments: undefined,
    commentString: "",
    displayCommentField: false
  };

  componentDidMount() {
    this.ismounted = true;
  }
  componentWillUnmount() {
    this.ismounted = false;
  }
  handleChange = stateObj => {
    if (this.ismounted) this.setState(stateObj);
  };

  render() {
    const { commentString, displayCommentField } = this.state;
    const { handleChange } = this.props; // Functions
    const { previewMode, problem, problemIndex } = this.props; // Variables

    return (
      <Container className="container-large column mb16">
        <Container
          className="x-fill column clickable bg-white mb8 br8"
          onClick={() => this.props.history.push("/problems?id=" + problem._id)}
        >
          <Container
            className="border-bottom justify-between py16 pl32 pr16"
            onClick={e => {}}
          >
            <Container>
              <Text
                className="round-icon bg-blue white mr8"
                text={capitolizeFirstChar(problem.author[0])}
                type="h6"
              />
              <Text text={capitolizeFirstChar(problem.author)} type="h5" />
            </Container>
            <Container className="x-wrap align-center">
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
            className={`column ${previewMode ? "" : "border-bottom"} py16 px32`}
          >
            <Text className="mb8 grey-8" text={problem.title} type="h5" />
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
                className="blue mr4"
                icon={faComment}
                onClick={e => {
                  e.stopPropagation();
                  this.handleChange({ displayCommentField: true });
                  if (!displayCommentField)
                    getProblemComments(this.context, problem, problemIndex);
                }}
              />
              <Text className="blue mr8" text={problem.commentsSize} type="p" />
              <FontAwesomeIcon
                className={`heart ${problem.hasLiked ? "red" : "grey-5"} mr4`}
                icon={problem.hasLiked ? faHeart2 : faHeart}
                onClick={e => {
                  e.stopPropagation();
                  if (problem.hasLiked) {
                  } else {
                    likeProblem(this.context, problem, problemIndex);
                  }
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
              <Container
                className="x-fill column clickable bg-white mt1"
                key={index}
                style={{
                  borderTopLeftRadius: index === 0 ? "8px" : "",
                  borderTopRightRadius: index === 0 ? "8px" : "",
                  borderBottomLeftRadius:
                    problem.commentsArray.length - 1 === index ? "8px" : "",
                  borderBottomRightRadius:
                    problem.commentsArray.length - 1 === index ? "8px" : ""
                }}
              >
                <Container className="justify-between py16 pl32 pr16">
                  <Container className="align-center">
                    <Text
                      className="round-icon bg-blue white mr8"
                      text={capitolizeFirstChar(comment.author[0])}
                      type="h6"
                    />
                    <Text
                      text={capitolizeFirstChar(comment.author)}
                      type="h5"
                    />
                  </Container>
                  <Container className="mb8">
                    <FontAwesomeIcon className="grey-5 mr8" icon={faClock} />
                    <Text
                      className="grey-5"
                      text={moment(comment.createdAt)
                        .subtract(1, "minute")
                        .fromNow()}
                      type="p"
                    />
                  </Container>
                </Container>
                <Text className="px32" text={comment.text} type="p" />
                {!previewMode && (
                  <Container className="py16 px32">
                    <FontAwesomeIcon
                      className={`heart ${
                        problem.hasLiked ? "red" : "grey-5"
                      } mr4`}
                      icon={comment.hasLiked ? faHeart2 : faHeart}
                      onClick={e => {}}
                    />
                    <Text className="grey-5" text={comment.upVotes} type="p" />
                  </Container>
                )}
              </Container>
            ))}
          </Container>
        )}
        {displayCommentField && !problem.commentsArray && (
          <Container>
            <LoadingHeart />
          </Container>
        )}
      </Container>
    );
  }
}

Problem.contextType = ExtraContext;

export default withRouter(Problem);
