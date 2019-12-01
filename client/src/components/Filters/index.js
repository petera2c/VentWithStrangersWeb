import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

import VWSContainer from "../../components/containers/VWSContainer";
import VWSText from "../../components/views/VWSText";

import Consumer, { ExtraContext } from "../../context";

class Filters extends Component {
  componentDidMount() {
    this.ismounted = true;
  }
  render() {
    return (
      <VWSContainer className="grey-1 full-center">
        <VWSText className="grey-1 mr8" text={`Filters`} type="h6" />
        <FontAwesomeIcon className="grey-5 mr16" icon={faChevronDown} />
        <VWSText className="grey-1 mr8" text={`Tags`} type="h6" />
        <FontAwesomeIcon className="grey-5 mr16" icon={faChevronDown} />
      </VWSContainer>
    );
  }
}

Filters.contextType = ExtraContext;

export default Filters;
