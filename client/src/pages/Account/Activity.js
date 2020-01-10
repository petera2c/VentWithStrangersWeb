import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import { ExtraContext } from "../../context";

import { capitolizeFirstChar } from "../../util";

class ActivitySection extends Component {
  state = {
    comments: false,
    posts: true
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
    const { comments, posts } = this.state;

    return (
      <Container className="container large column pa16">
        <Text className="mb16" text="Activity" type="h4" />
        <Container className="ov-hidden column bg-white mb16 br4">
          <Container>
            <Container
              className={
                "x-50 button-4 clickable full-center py16" +
                this.isActive(posts)
              }
              onClick={() =>
                this.handleChange({ comments: false, posts: true })
              }
            >
              <Text className="tac" text="Posts" type="h5" />
            </Container>
            <Container
              className={
                "x-50 button-4 clickable full-center py16" +
                this.isActive(comments)
              }
              onClick={() =>
                this.handleChange({ posts: false, comments: true })
              }
            >
              <Text className="tac" text="Comments" type="h5" />
            </Container>
          </Container>
        </Container>
        <Container className="ov-hidden column bg-white mb16 br4"></Container>
      </Container>
    );
  }
}

ActivitySection.contextType = ExtraContext;

export default withRouter(ActivitySection);
