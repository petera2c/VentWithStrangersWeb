import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { withRouter } from "react-router-dom";
import TextArea from "react-textarea-autosize";

import { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons/faClock";
import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";
import { faHeart as faHeart2 } from "@fortawesome/free-solid-svg-icons/faHeart";

import Container from "../containers/Container";
import Text from "../views/Text";

import { capitolizeFirstChar } from "../../util";
import { likeComment, unlikeComment } from "./util";

class Comment extends Component {
  render() {
    const { arrayLength, comment, index } = this.props; // Variables

    return (
      <Container
        className="x-fill column bg-white mt1"
        style={{
          borderTopLeftRadius: index === 0 ? "8px" : "",
          borderTopRightRadius: index === 0 ? "8px" : "",
          borderBottomLeftRadius: arrayLength - 1 === index ? "8px" : "",
          borderBottomRightRadius: arrayLength - 1 === index ? "8px" : ""
        }}
      >
        <Container className="justify-between wrap py16 px32">
          <Container className="align-center mb8">
            <Text
              className="round-icon bg-blue white mr8"
              text={capitolizeFirstChar(comment.author[0])}
              type="h6"
            />
            <Text
              className="fw-400"
              text={capitolizeFirstChar(comment.author)}
              type="h5"
            />
          </Container>
          <Container className="align-center wrap mb8">
            <FontAwesomeIcon className="clickable grey-5 mr8" icon={faClock} />
            <Text
              className="grey-5"
              text={moment(comment.createdAt)
                .subtract(1, "minute")
                .fromNow()}
              type="p"
            />
          </Container>
        </Container>
        <Text className="px32" text={comment.text} type="p" />
        <Container className="align-center py16 px32">
          <FontAwesomeIcon
            className={`clickable heart ${
              comment.hasLiked ? "red" : "grey-5"
            } mr4`}
            icon={comment.hasLiked ? faHeart2 : faHeart}
            onClick={() => {
              if (comment.hasLiked) unlikeComment(this.context, comment, index);
              else likeComment(this.context, comment, index);
            }}
          />
          <Text className="grey-5" text={comment.upVotes} type="p" />
        </Container>
      </Container>
    );
  }
}

Comment.contextType = ExtraContext;

export default withRouter(Comment);
