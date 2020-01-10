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
  state = {
    problem: undefined
  };
  componentDidMount() {
    this._ismounted = true;

    const { location } = this.props;
    const { notify, socket } = this.context;
    const { search } = location;

    socket.emit("get_problem", search.slice(1, search.length), result => {
      const { message, problem, success } = result;

      if (success) this.handleChange({ problem });
      else notify({ message, type: "danger" });
    });
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObject => {
    if (this._ismounted) this.setState(stateObject);
  };
  render() {
    const { problem } = this.state;

    return (
      <Page
        className="justify-center align-start bg-grey py32"
        description="Problem"
        keywords=""
        title="Problem"
      >
        {problem && problem._id && (
          <Container className="x-fill column">
            <Problem handleChange={this.handleChange} problem={problem} />
          </Container>
        )}
        {!problem && <LoadingHeart />}
      </Page>
    );
  }
}
ProblemPage.contextType = ExtraContext;

export default ProblemPage;
