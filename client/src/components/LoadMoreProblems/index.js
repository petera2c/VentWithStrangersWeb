import React, { Component } from "react";
import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/pro-solid-svg-icons/faFire";

import LoadingHeart from "../loaders/Heart";

import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

class LoadMoreProblems extends Component {
  componentDidMount() {
    const { loadMore = () => {} } = this.props;

    var timeout;
    window.onscroll = ev => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
          loadMore();
        }
      }, 50);
    };
  }
  render() {
    const { loadMore = () => {} } = this.props;

    return (
      <Container className="column x-fill full-center" onClick={loadMore}>
        <Container className="clickable x-fill column bg-white mb16 br8">
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
            <div className="x-fill bg-grey-2 br8" style={{ height: "100px" }} />
          </Container>
          <Container className="py16 px32">
            <div
              className=" bg-grey-2 br16"
              style={{ width: "140px", height: "24px" }}
            />
          </Container>
        </Container>

        <LoadingHeart />
      </Container>
    );
  }
}

LoadMoreProblems.contextType = ExtraContext;

export default LoadMoreProblems;
