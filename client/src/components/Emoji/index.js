import React, { Component, useState } from "react";
import Picker from "emoji-picker-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmileBeam } from "@fortawesome/free-regular-svg-icons/faSmileBeam";

import Container from "../containers/Container";

import Button from "../views/Button";

class Emoji extends Component {
  state = {
    displayEmojiDropdown: false
  };

  render() {
    const { displayEmojiDropdown } = this.state;
    const { handleChange } = this.props;

    return (
      <Container className="column relative pa8 mx8">
        <Button
          onClick={() =>
            this.setState({ displayEmojiDropdown: !displayEmojiDropdown })
          }
        >
          <FontAwesomeIcon className="grey-5" icon={faSmileBeam} />
        </Button>
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            right: 0,
            display: displayEmojiDropdown ? "" : "none"
          }}
        >
          <Picker
            onEmojiClick={(event, emojiObject) => {
              this.setState({ displayEmojiDropdown: false });
              handleChange(emojiObject.emoji);
            }}
          />
        </div>
      </Container>
    );
  }
}

export default Emoji;
