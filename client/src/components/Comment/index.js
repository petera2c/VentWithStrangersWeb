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
import { likeComment, swapTags, unlikeComment } from "./util";

class Comment extends Component {
  render() {
    const { history } = this.props;
    const { arrayLength, comment, index } = this.props; // Variables
    const { updateCommentLikes } = this.props;

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
          <Container
            className="clickable align-center mb8"
            onClick={e => {
              e.preventDefault();
              history.push("/activity?" + comment.authorID);
            }}
          >
            <Text
              className="round-icon bg-blue white mr8"
              text={capitolizeFirstChar(comment.author[0])}
              type="h6"
            />
            <Text
              className="button-1 fw-400"
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
        <Text className="px32" type="p">
          {swapTags(comment.text)}
        </Text>
        <Container
          className="align-center py16 px32"
          onClick={e => {
            e.preventDefault();

            if (comment.hasLiked)
              unlikeComment(this.context, comment, index, updateCommentLikes);
            else likeComment(this.context, comment, index, updateCommentLikes);
          }}
        >
          <FontAwesomeIcon
            className={`clickable heart ${
              comment.hasLiked ? "red" : "grey-5"
            } mr4`}
            icon={comment.hasLiked ? faHeart2 : faHeart}
          />
          <Text
            className="grey-5"
            text={comment.upVotes ? comment.upVotes : 0}
            type="p"
          />
        </Container>
      </Container>
    );
  }
}

Comment.contextType = ExtraContext;

export default withRouter(Comment);
