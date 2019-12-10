import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons/faClock";
import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";
import { faComment } from "@fortawesome/free-regular-svg-icons/faComment";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";

import VWSContainer from "../containers/VWSContainer";
import VWSButton from "../views/VWSButton";
import VWSText from "../views/VWSText";

import { capitolizeFirstChar } from "../../util";

class Problem extends Component {
  state = {};

  render() {
    const { handleChange } = this.props; // Functions
    const { problem } = this.props; // Variabless

    return (
      <VWSContainer className="container-large column bg-white mb16 br8">
        <VWSContainer className="border-bottom justify-between py16 pl32 pr16">
          <VWSContainer>
            <VWSText
              className="round-icon bg-blue white mr8"
              text={capitolizeFirstChar(problem.author.name[0])}
              type="h6"
            />
            <VWSText
              text={capitolizeFirstChar(problem.author.name)}
              type="h5"
            />
          </VWSContainer>
          <VWSContainer className="align-center">
            {problem.tags.map((tag, index) => (
              <VWSText key={index} text={tag.name} type="p" />
            ))}
            <FontAwesomeIcon className="grey-9 ml16" icon={faEllipsisV} />
          </VWSContainer>
        </VWSContainer>
        <VWSContainer className="column border-bottom py16 px32">
          <VWSText className="mb8 grey-8" text={problem.title} type="h5" />
          <VWSContainer className="mb8">
            <FontAwesomeIcon className="grey-5 mr8" icon={faClock} />
            <VWSText
              className="grey-5"
              text={moment(problem.createdAt)
                .subtract(1, "minute")
                .fromNow()}
              type="p"
            />
          </VWSContainer>
          <VWSText className="" text={problem.description} type="p" />
        </VWSContainer>
        <VWSContainer className="py16 px32">
          <FontAwesomeIcon className="blue mr4" icon={faComment} />
          <VWSText
            className="blue mr8"
            text={problem.comments.length}
            type="p"
          />
          <FontAwesomeIcon className="grey-5 mr4" icon={faHeart} />
          <VWSText className="grey-5" text={problem.upVotes} type="p" />
        </VWSContainer>
      </VWSContainer>
    );
  }
}

export default Problem;
