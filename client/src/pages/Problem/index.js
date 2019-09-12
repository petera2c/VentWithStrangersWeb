import React, { Component } from "react";
import moment from "moment-timezone";
import TextArea from "react-textarea-autosize";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

import GIText from "../../components/views/GIText";
import GIButton from "../../components/views/GIButton";
import GIInput from "../../components/views/GIInput";
import Consumer from "../../context";

class ProblemPage extends Component {
  render() {
    const {
      author,
      comments = [],
      createdAt,
      description,
      title
    } = this.props.problem;
    return (
      <Page
        className="column align-center py32"
        description="Problem"
        keywords=""
        title="Problem"
      >
        <GIContainer className="column x-50">
          <GIContainer className="column x-fill bg-white py32 px64 br16">
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
        {comments.length > 0 && (
          <GIContainer className="column x-50 bg-white py32 px64 br16">
            {comments.map((comment, index) => (
              <GIContainer>{comment.text}</GIContainer>
            ))}
          </GIContainer>
        )}
      </Page>
    );
  }
}

export default ProblemPage;
