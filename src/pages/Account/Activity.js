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

import Vent from "../../components/Vent";
import Comment from "../../components/Comment";

import LoadMore from "../../components/LoadMore";

import { isMobileOrTablet } from "../../util";
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
          <Container
            className={
              "container column px16 " +
              (isMobileOrTablet() ? "mobile-full" : "large")
            }
          >
            <Text className="mb16" text="Activity" type="h4" />
            <Container className="ov-hidden column bg-white border-all2 mb16 br8">
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
                {context.vents &&
                  context.vents.map((vent, index) => (
                    <Vent
                      key={index}
                      previewMode={true}
                      vent={vent}
                      ventIndex={index}
                    />
                  ))}
                {context.vents && context.vents.length === 0 && (
                  <Text className="fw-400" text="No vents found." type="h4" />
                )}
                {context.canLoadMore && (
                  <LoadMore
                    canLoadMore={context.canLoadMore}
                    loadMore={() => {
                      context.handleChange({ skip: context.skip + 10 }, () => {
                        getUsersPosts(
                          context.handleChange,
                          context.notify,
                          context.vents,
                          search,
                          context.skip + 10,
                          context.socket,
                          context.user
                        );
                      });
                    }}
                  >
                    <Container className="clickable x-fill column bg-white border-all2 mb16 br8">
                      <Container className="justify-between pt16 px32">
                        <Container>
                          <div className="round-icon bg-grey-2 mr8" />
                          <div
                            className=" bg-grey-2 br16"
                            style={{ width: "140px", height: "24px" }}
                          />
                        </Container>
                        <div
                          className="bg-grey-2 br16"
                          style={{ width: "140px", height: "24px" }}
                        />
                      </Container>
                      <Container className="pt16 px32">
                        <div
                          className="x-fill bg-grey-2 br8"
                          style={{ height: "100px" }}
                        />
                      </Container>
                      <Container className="py16 px32">
                        <div
                          className=" bg-grey-2 br16"
                          style={{ width: "140px", height: "24px" }}
                        />
                      </Container>
                    </Container>
                  </LoadMore>
                )}
              </Container>
            )}
            {commentsSection && (
              <Container className="x-fill column">
                <Container className="column border-all2 br8">
                  {context.comments &&
                    context.comments.map((comment, index) => {
                      return (
                        <Link
                          key={index}
                          to={"/problem/" + comment.problemID + "/"}
                        >
                          <Comment
                            arrayLength={context.comments.length}
                            comment={comment}
                            commentIndex={index}
                          />
                        </Link>
                      );
                    })}
                </Container>
                {context.comments && context.comments.length === 0 && (
                  <Text
                    className="fw-400"
                    text="No comments found."
                    type="h4"
                  />
                )}
              </Container>
            )}
            {((!context.vents && postsSection) ||
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
