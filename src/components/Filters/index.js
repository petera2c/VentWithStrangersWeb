import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import TagsModal from "../modals/Tags";

class Filters extends Component {
  state = {
    tagsModal: false
  };
  componentDidMount() {
    this.ismounted = true;
  }
  componentWillUnmount() {
    this.ismounted = false;
  }
  handleChange = stateObj => {
    if (this.ismounted) this.setState(stateObj);
  };

  render() {
    const { tagsModal } = this.state;

    return (
      <Container className="grey-1 full-center">
        <Container
          className="full-center clickable"
          onClick={() => this.handleChange({ tagsModal: true })}
        >
          <Text className="grey-1 fw-400 mr8" text="Tags" type="h6" />
          <FontAwesomeIcon className="grey-5" icon={faChevronDown} />
        </Container>

        {tagsModal && (
          <TagsModal close={() => this.handleChange({ tagsModal: false })} />
        )}
      </Container>
    );
  }
}

export default Filters;
