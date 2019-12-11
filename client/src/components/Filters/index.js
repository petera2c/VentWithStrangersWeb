import React, { Component } from "react";
import { Link } from "react-router-dom";
import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import FiltersModal from "../modals/Filters";
import TagsModal from "../modals/Tags";

class Filters extends Component {
  state = {
    filtersModal: false,
    tagsModal: true
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
    const { filtersModal, tagsModal } = this.state;
    return (
      <Container className="grey-1 full-center">
        <Container
          className="full-center clickable mr16"
          onClick={() => this.handleChange({ filtersModal: true })}
        >
          <Text className="grey-1 mr8" text="Filters" type="h6" />
          <FontAwesomeIcon className="grey-5" icon={faChevronDown} />
        </Container>
        <Container
          className="full-center clickable"
          onClick={() => this.handleChange({ tagsModal: true })}
        >
          <Text className="grey-1 mr8" text="Tags" type="h6" />
          <FontAwesomeIcon className="grey-5" icon={faChevronDown} />
        </Container>
        {filtersModal && (
          <FiltersModal
            close={() => this.handleChange({ filtersModal: false })}
          />
        )}
        {tagsModal && (
          <TagsModal close={() => this.handleChange({ tagsModal: false })} />
        )}
      </Container>
    );
  }
}

Filters.contextType = ExtraContext;

export default Filters;
