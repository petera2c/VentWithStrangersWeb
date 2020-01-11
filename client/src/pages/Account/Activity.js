import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import LoadingHeart from "../../components/loaders/Heart";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import Problem from "../../components/Problem";

import { ExtraContext } from "../../context";

import { capitolizeFirstChar } from "../../util";

class ActivitySection extends Component {
  state = {
    commentsSection: false,
    postsSection: true
  };

  componentDidMount() {
    this._ismounted = true;

    this.getUserPosts();
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

  getUserPosts = () => {
    const { handleChange, notify, socket, user } = this.context;
    const { location } = this.props;
    const { search } = location;

    let searchID = user._id;
    if (search) searchID = location.search.slice(1, search.length);

    socket.emit("get_users_posts", { searchID }, result => {
      const { message, problems, success } = result;

      if (success) handleChange({ problems });
      else notify({ message, type: "danger" });
    });
  };

  getUserComments = () => {
    const { socket } = this.context;
    const { location } = this.props;
    const search = { location };
    const userID = location.search.slice(1, search.length);

    //socket.emit("get_users_posts", { userID }, () => {});
  };

  render() {
    const { commentsSection, postsSection } = this.state;
    const { problems } = this.context;
    let comments;
    return (
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
              onClick={() =>
                this.handleChange({ postsSection: false, comments: true })
              }
            >
              <Text className="tac" text="Comments" type="h5" />
            </Container>
          </Container>
        </Container>
        {postsSection && (
          <Container className="x-fill column">
            {problems &&
              problems.map((problem, index) => (
                <Problem key={index} problem={problem} problemIndex={index} />
              ))}
            {problems && problems.length === 0 && (
              <Text className="fw-400" text="No problems found." type="h4" />
            )}
          </Container>
        )}
        {commentsSection && (
          <Container className="x-fill column">
            {comments &&
              comments.map((problem, index) => (
                <Comment key={index} comment={comment} />
              ))}
            {comments && comments.length === 0 && (
              <Text className="fw-400" text="No comments found." type="h4" />
            )}
          </Container>
        )}
        {!problems && (
          <Container className="x-fill full-center">
            <LoadingHeart />
          </Container>
        )}
      </Container>
    );
  }
}

ActivitySection.contextType = ExtraContext;

export default withRouter(ActivitySection);
