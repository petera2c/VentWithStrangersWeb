import React, { Component } from "react";
import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/pro-solid-svg-icons/faFire";

import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

class LoadMore extends Component {
  render() {
    return (
      <Container className="clickable x-fill column bg-white br8">
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
    );
  }
}

LoadMore.contextType = ExtraContext;

export default LoadMore;
