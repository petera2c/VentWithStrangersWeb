import React, { Component } from "react";
import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/pro-solid-svg-icons/faFire";

import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import "./style.css";

class LoadMore extends Component {
  render() {
    return (
      <Container className="x-fill column bg-white br8">
        <Container className="border-bottom justify-between py16 pl32 pr16">
          <div className="test1" />
        </Container>
      </Container>
    );
  }
}

LoadMore.contextType = ExtraContext;

export default LoadMore;
