import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";

import Container from "../../../components/containers/Container";
import Text from "../../../components/views/Text";
import Input from "../../../components/views/Input";

import Consumer, { ExtraContext } from "../../../context";

const recentTags = [
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello"
];

class TagsModal extends Component {
  state = {
    searchString: ""
  };
  componentDidMount() {
    this.ismounted = true;
  }
  render() {
    const { searchString } = this.state;
    const { close } = this.props;

    return (
      <Container className="modal-container">
        <Container className="modal container medium column bg-white br4">
          <Container className="x-fill full-center bg-grey-10 pa16">
            <Text className="fw-400 grey-8" text="Tags Filters" type="h4" />
          </Container>
          <Container className="x-fill column px32 py16">
            <Container className="border-bottom justify-between align-center mb16">
              <Container className="align-center">
                <FontAwesomeIcon icon={faSearch} />
                <Input
                  className="no-border py8 px16 br4"
                  value={searchString}
                  onChange={event =>
                    this.handleChange({ searchString: event.target.value })
                  }
                  type="text"
                  placeholder="Search"
                  required
                />
              </Container>
              <Text className="blue" text="Reset Tags" type="p" />
            </Container>
            <Text className="grey-8" text="Recent Tags" type="h6" />
            <Container className="x-fill grid-1">
              {recentTags.map((tag, index) => (
                <Text
                  className="fw-300 border-all px16 py8"
                  text={tag}
                  type="p"
                />
              ))}
            </Container>
          </Container>
        </Container>
        <Container className="modal-background" onClick={close} />
      </Container>
    );
  }
}

TagsModal.contextType = ExtraContext;

export default TagsModal;
