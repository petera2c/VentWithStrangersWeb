import React, { Component } from "react";
import moment from "moment-timezone";
import TextArea from "react-textarea-autosize";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

import GIText from "../../components/views/GIText";
import GIButton from "../../components/views/GIButton";
import GIInput from "../../components/views/GIInput";
import Consumer from "../../context";

import { addComment, getComments } from "./util";

class ProblemPage extends Component {
  state = { comment: "", comments: this.props.problem.comments };
  handleChange = stateObject => {
    this.setState(stateObject);
  };
  createComment = comment => {
    const problemID = this.props.problem._id;
    addComment(
      (comments, success) => {
        if (success) {
          this.setState({ comment: "", comments });
        } else
          alert("Something went wrong :( Please reload the page and try again");
      },
      comment,
      problemID
    );
  };
  render() {
    const { author, createdAt, description, title } = this.props.problem;
    const { comment, comments = [] } = this.state;
    return (
      <Page
        className="column align-center py32"
        description="Problem"
        keywords=""
        title="Problem"
      >
        <GIContainer className="column x-50">
          <GIContainer className="column x-fill bg-white pa32 br16">
            <GIText className="tac mb16" text={title} type="h4" />
            <GIText className="x-fill mb16" text={description} type="p" />
          </GIContainer>
          <GIText
            className="x-fill tar white mb16"
            text={`Created at ${new moment(createdAt).format("LLLL")}`}
            type="p"
          />
          <GIText
            className="x-fill tar white mb16"
            text={`By ${author.name}`}
            type="p"
          />
        </GIContainer>
        <GIContainer className="column x-50 mb16">
          <TextArea
            className="x-fill bg-white pa16 mb8 br8"
            onChange={event =>
              this.handleChange({ comment: event.target.value })
            }
            placeholder="Type a helpful message here :) ..."
            style={{ minHeight: "100px" }}
            value={comment}
          />
          <GIContainer className="x-fill justify-end">
            <GIButton
              className="bg-white py4 px8 br8"
              onClick={() => this.createComment(comment)}
              text="Submit"
            />
          </GIContainer>
        </GIContainer>

        {comments.length > 0 && (
          <GIContainer className="column x-50 bg-white pa32 br16">
            {comments.map((comment, index) => (
              <GIContainer key={index}>{comment.text}</GIContainer>
            ))}
          </GIContainer>
        )}
      </Page>
    );
  }
}

export default ProblemPage;
