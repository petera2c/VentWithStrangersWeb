import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

import Container from "../../../components/containers/Container";
import Text from "../../../components/views/Text";

import Consumer, { ExtraContext } from "../../../context";

class FiltersModal extends Component {
  componentDidMount() {
    this.ismounted = true;
  }
  render() {
    return (
      <Container className="modal-container">
        <Container className="modal">hello world</Container>
        <Container className="modal-background" />
      </Container>
    );
  }
}

FiltersModal.contextType = ExtraContext;

export default FiltersModal;
