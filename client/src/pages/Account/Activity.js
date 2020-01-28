import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Consumer from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import LoadingHeart from "../../components/loaders/Heart";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import Problem from "../../components/Problem";
import Comment from "../../components/Comment";

import LoadMoreProblems from "../../components/LoadMoreProblems";

import { capitolizeFirstChar } from "../../util";
import { getUsersPosts } from "../util";

class ActivitySection extends Component {
  state = {
    commentsSection: false,
    postsSection: true
  };

  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };

  isActive = test => {
    if (test) return " active";
    else return "";
  };

  render() {
    const { commentsSection, postsSection } = this.state;

    const { search } = this.props.location;

    return (
      <Consumer>
        {context => (
          <Container className="container large column pa16">
            <Text className="mb16" text="Activity" type="h4" />
            <Container className="ov-hidden column bg-white mb16 br4">
              <Container>
                <Container
                  className={
                    "x-50 button-4 clickable full-center py16" +
                    this.isActive(postsSection)
                  }
                  onClick={() =>
                    this.handleChange({
                      commentsSection: false,
                      postsSection: true
                    })
                  }
                >
                  <Text className="tac" text="Posts" type="h5" />
                </Container>
                <Container
                  className={
                    "x-50 button-4 clickable full-center py16" +
                    this.isActive(commentsSection)
                  }
                  onClick={() => {
                    this.handleChange({
                      postsSection: false,
                      commentsSection: true
                    });
                  }}
                >
                  <Text className="tac" text="Comments" type="h5" />
                </Container>
              </Container>
            </Container>
            {postsSection && (
              <Container className="x-fill column">
                {context.problems &&
                  context.problems.map((problem, index) => (
                    <Problem
                      key={index}
                      previewMode={true}
                      problem={problem}
                      problemIndex={index}
                    />
                  ))}
                {context.problems && context.problems.length === 0 && (
                  <Text
                    className="fw-400"
                    text="No problems found."
                    type="h4"
                  />
                )}
                {context.canLoadMorePosts && (
                  <LoadMoreProblems
                    canLoadMorePosts={context.canLoadMorePosts}
                    loadMore={() => {
                      context.handleChange({ skip: context.skip + 10 }, () => {
                        getUsersPosts(
                          context.handleChange,
                          context.notify,
                          context.problems,
                          search,
                          context.skip + 10,
                          context.socket,
                          context.user
                        );
                      });
                    }}
                  />
                )}
              </Container>
            )}
            {commentsSection && (
              <Container className="x-fill column">
                {context.comments &&
                  context.comments.map((comment, index) => (
                    <Comment
                      arrayLength={context.comments.length}
                      comment={comment}
                      key={index}
                      index={index}
                    />
                  ))}
                {context.comments && context.comments.length === 0 && (
                  <Text
                    className="fw-400"
                    text="No comments found."
                    type="h4"
                  />
                )}
              </Container>
            )}
            {((!context.problems && postsSection) ||
              (!context.comments && !postsSection)) && (
              <Container className="x-fill full-center">
                <LoadingHeart />
              </Container>
            )}
          </Container>
        )}
      </Consumer>
    );
  }
}

export default withRouter(ActivitySection);
