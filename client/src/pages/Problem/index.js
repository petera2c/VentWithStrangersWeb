import React, { Component } from "react";
import moment from "moment-timezone";
import TextArea from "react-textarea-autosize";
import { ExtraContext } from "../../context";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Problem from "../../components/Problem";

import LoadingHeart from "../../components/loaders/Heart";

import Text from "../../components/views/Text";
import Button from "../../components/views/Button";
import Input from "../../components/views/Input";
import Consumer from "../../context";

class ProblemPage extends Component {
  componentDidMount() {
    this._ismounted = true;

    const { location } = this.props;
    const { handleChange, notify, socket } = this.context;
    const { search } = location;

    socket.emit("get_problem", search.slice(1, search.length), result => {
      const { message, problems, success } = result;

      if (success)
        handleChange({
          problems
        });
      else if (message) notify({ message, type: "danger" });
      else
        notify({
          message:
            "Something unexpected has happened, please refresh the page and try again.",
          type: "danger"
        });
    });
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  render() {
    const { problems } = this.context;
    let title = "";
    let description = "";

    if (problems && problems[0] && problems[0].title) title = problems[0].title;
    if (problems && problems[0] && problems[0].description)
      description = problems[0].description;

    return (
      <Page
        className="justify-center align-start bg-grey py32"
        description={description}
        keywords=""
        title={title}
      >
        {problems && (
          <Container className="container large column">
            <Problem
              displayCommentField
              problem={problems[0]}
              problemIndex={0}
            />
          </Container>
        )}
        {!problems && <LoadingHeart />}
      </Page>
    );
  }
}
ProblemPage.contextType = ExtraContext;

export default ProblemPage;
