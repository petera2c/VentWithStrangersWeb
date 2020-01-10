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
/*


[
  {
    _id: "5e17cb91c64eefa7a4fdafe2",
    authorID: "5e14e921a9d6f26fa452b864",
    commentsSize: 0,
    createdAt: "2020-01-10T00:55:45.384Z",
    dailyUpvotes: 0,
    description: "2354345",
    hasLiked: false,
    tags: [{ _id: "5e17cb91c64eefa7a4fdafe3", name: "2534543" }],
    title: "523454",
    upVotes: 0,
    author: "peter101"
  }
]


*/
class ProblemPage extends Component {
  componentDidMount() {
    this._ismounted = true;

    const { location } = this.props;
    const { handleChange, notify, socket } = this.context;
    const { search } = location;
    handleChange({ problems: undefined });

    socket.emit("get_problem", search.slice(1, search.length), result => {
      const { message, problems, success } = result;

      if (success)
        handleChange({
          problems
        });
      else notify({ message, type: "danger" });
    });
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  render() {
    const { problems } = this.context;

    return (
      <Page
        className="justify-center align-start bg-grey py32"
        description="Problem"
        keywords=""
        title="Problem"
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
