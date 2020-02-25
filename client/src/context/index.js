import React, { Component, createContext } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

const ExtraContext = createContext();
const { Provider, Consumer } = ExtraContext;

class GIProvider extends Component {
  state = {
    canLoadMorePosts: true,
    comments: undefined,
    hotTags: [],
    skip: 0,
    notification: {
      on: false,
      message: "",
      type: "danger"
    },
    problems: undefined,
    saving: false,
    socket: undefined,
    user: undefined
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  addComment = (comment, problemIndex) => {
    let { problems, user } = this.state;
    comment.author = user.displayName;

    if (!problems[problemIndex].commentsArray)
      problems[problemIndex].commentsArray = [];

    problems[problemIndex].commentsArray.unshift(comment);

    this.handleChange({ problems });
  };

  getProblems = (pathname, search) => {
    const { skip } = this.state;
    let tagTemp = "";
    let tags = [];

    if (search && search.slice(0, 5) === "tags=") {
      const tagString = search.slice(5, search.length);
      for (let index in tagString) {
        if (tagString[index] == "+") {
          tags.push(tagTemp);
          tagTemp = "";
        } else tagTemp += tagString[index];
      }
      if (tagTemp) tags.push(tagTemp);
    }

    axios
      .post("/api/problems", {
        page: pathname.slice(1, pathname.length),
        skip,
        tags
      })
      .then(res => {
        const { problems, success } = res.data;
        let newProblems = problems;
        let canLoadMorePosts = true;

        if (problems && problems.length < 10) canLoadMorePosts = false;
        if (skip && this.state.problems)
          newProblems = this.state.problems.concat(newProblems);

        if (success)
          this.handleChange({
            canLoadMorePosts,
            problems: newProblems
          });
        else {
          // TODO: handle error
        }
      });
  };
  handleChange = (stateObject, callback) => {
    if (this._ismounted) this.setState(stateObject, callback);
  };

  notify = newNotification => {
    newNotification.on = true;
    this.setState({ notification: newNotification });
    alert(newNotification.message);

    if (newNotification.on) {
      setTimeout(() => {
        let { notification } = this.state;
        notification.on = false;
        this.setState({ notification });
      }, 5000);
    }
  };
  removeProblem = problemIndex => {
    let { problems } = this.state;

    problems.splice(problemIndex, 1);

    this.handleChange({ problems });
  };
  updateProblem = (problem, problemIndex) => {
    let { problems } = this.state;
    problems[problemIndex] = problem;
    this.handleChange({ problems });
  };
  render() {
    const {
      canLoadMorePosts,
      comments,
      hotTags,
      skip,
      notification,
      problems,
      saving,
      socket,
      user
    } = this.state;

    return (
      <Provider
        value={{
          addComment: this.addComment,
          canLoadMorePosts,
          comments,
          getProblems: this.getProblems,
          handleChange: this.handleChange,
          hotTags,
          skip,
          notify: this.notify,
          problems,
          removeProblem: this.removeProblem,
          saving,
          socket,
          updateProblem: this.updateProblem,
          user
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { GIProvider, ExtraContext };

export default withRouter(Consumer);
