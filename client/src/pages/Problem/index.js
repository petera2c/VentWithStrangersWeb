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

import { isMobileOrTablet } from "../../util";

const getProblemIdFromURL = pathname => {
  // regular expression will not work due to catastrophic backtracing
  //pathname.match(/(?<=\/problem\/\s*).*?(?=\s*\/)/gs);
  if (pathname) {
    const problemIdStart = pathname.slice(9, pathname.length);
    let problemID = "";
    for (let index in problemIdStart) {
      if (problemIdStart[index] === "/") break;
      problemID += problemIdStart[index];
    }

    return problemID;
  }
};

class ProblemPage extends Component {
  componentDidMount() {
    this._ismounted = true;

    const { location } = this.props;
    const { handleChange, notify, socket } = this.context;
    const { pathname } = location;

    const regexMatch = getProblemIdFromURL(pathname);
    let problemID;
    if (regexMatch) problemID = regexMatch;

    if (problemID)
      socket.emit("get_problem", problemID, result => {
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
    else
      notify({
        message: "No post ID.",
        type: "danger"
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
        className="justify-start align-center bg-grey-2"
        description={description}
        keywords=""
        title={title}
      >
        <Container className={isMobileOrTablet() ? "py16" : "py32"}>
          {problems && (
            <Container
              className={
                "column " +
                (isMobileOrTablet()
                  ? "container mobile-full px16"
                  : "container large ")
              }
            >
              <Problem
                displayCommentField
                problem={problems[0]}
                problemIndex={0}
              />
            </Container>
          )}
          {!problems && <LoadingHeart />}
        </Container>
      </Page>
    );
  }
}
ProblemPage.contextType = ExtraContext;

export default ProblemPage;
