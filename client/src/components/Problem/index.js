import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons/faClock";
import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";
import { faComment } from "@fortawesome/free-regular-svg-icons/faComment";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";

import Container from "../containers/Container";
import Button from "../views/Button";
import Text from "../views/Text";

import { capitolizeFirstChar } from "../../util";
import { addTagsToPage } from "../../util";

class Problem extends Component {
  state = {};

  render() {
    const { handleChange } = this.props; // Functions
    const { problem } = this.props; // Variabless

    return (
      <Container className="container-large column bg-white mb16 br8">
        <Container className="border-bottom justify-between py16 pl32 pr16">
          <Container>
            <Text
              className="round-icon bg-blue white mr8"
              text={capitolizeFirstChar(problem.author.name[0])}
              type="h6"
            />
            <Text text={capitolizeFirstChar(problem.author.name)} type="h5" />
          </Container>
          <Container className="x-wrap align-center">
            {problem.tags.map((tag, index) => (
              <Text
                className="clickable mr8"
                key={index}
                onClick={() => addTagsToPage(this.props, [tag])}
                text={tag.name}
                type="p"
              />
            ))}
            <FontAwesomeIcon className="grey-9 ml16" icon={faEllipsisV} />
          </Container>
        </Container>
        <Container className="column border-bottom py16 px32">
          <Text className="mb8 grey-8" text={problem.title} type="h5" />
          <Container className="mb8">
            <FontAwesomeIcon className="grey-5 mr8" icon={faClock} />
            <Text
              className="grey-5"
              text={moment(problem.createdAt)
                .subtract(1, "minute")
                .fromNow()}
              type="p"
            />
          </Container>
          <Text className="" text={problem.description} type="p" />
        </Container>
        <Container className="py16 px32">
          <FontAwesomeIcon className="blue mr4" icon={faComment} />
          <Text className="blue mr8" text={problem.comments.length} type="p" />
          <FontAwesomeIcon className="grey-5 mr4" icon={faHeart} />
          <Text className="grey-5" text={problem.upVotes} type="p" />
        </Container>
      </Container>
    );
  }
}

export default withRouter(Problem);
