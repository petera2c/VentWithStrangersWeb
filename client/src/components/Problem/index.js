import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { withRouter } from "react-router-dom";
import { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons/faClock";
import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";
import { faHeart as faHeart2 } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faComment } from "@fortawesome/free-regular-svg-icons/faComment";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";

import Container from "../containers/Container";
import Button from "../views/Button";
import Text from "../views/Text";

import { capitolizeFirstChar } from "../../util";
import { addTagsToPage } from "../../util";
import { likeProblem } from "./util";

class Problem extends Component {
  state = {};

  render() {
    const { handleChange } = this.props; // Functions
    const { previewMode, problem } = this.props; // Variabless

    return (
      <Container
        className="container-large column clickable bg-white mb16 br8"
        onClick={() => this.props.history.push("/problems?id=" + problem._id)}
      >
        <Container
          className="border-bottom justify-between py16 pl32 pr16"
          onClick={e => {}}
        >
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
                className="button-1 clickable mr8"
                key={index}
                onClick={e => {
                  e.stopPropagation();
                  addTagsToPage(this.props, [tag]);
                }}
                text={tag.name}
                type="p"
              />
            ))}
            <FontAwesomeIcon className="grey-9 ml16" icon={faEllipsisV} />
          </Container>
        </Container>
        <Container
          className={`column ${previewMode ? "" : "border-bottom"} py16 px32`}
        >
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
          <Text
            className=""
            text={
              previewMode
                ? problem.description.slice(0, 100)
                : problem.description
            }
            type="p"
          />
        </Container>
        {!previewMode && (
          <Container className="py16 px32">
            <FontAwesomeIcon className="blue mr4" icon={faComment} />
            <Text
              className="blue mr8"
              text={problem.comments.length}
              type="p"
            />
            <FontAwesomeIcon
              className="grey-5 heart mr4"
              icon={faHeart}
              onClick={e => {
                e.stopPropagation();
                likeProblem(problem._id, this.context.socket);
              }}
            />
            <Text className="grey-5" text={problem.upVotes} type="p" />
          </Container>
        )}
      </Container>
    );
  }
}

Problem.contextType = ExtraContext;

export default withRouter(Problem);
