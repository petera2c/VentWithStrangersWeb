import React, { Component, useState } from "react";
import Picker from "emoji-picker-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmileBeam } from "@fortawesome/free-solid-svg-icons/faSmileBeam";

import VWSContainer from "../containers/VWSContainer";

import VWSButton from "../views/VWSButton";

class Emoji extends Component {
  state = {
    displayEmojiDropdown: false
  };
  render() {
    const { displayEmojiDropdown } = this.state;

    return (
      <VWSContainer className="column relative pa8 mx8">
        <VWSButton
          onClick={() =>
            this.setState({ displayEmojiDropdown: !displayEmojiDropdown })
          }
        >
          <FontAwesomeIcon icon={faSmileBeam} />
        </VWSButton>
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            right: 0,
            display: displayEmojiDropdown ? "" : "none"
          }}
        >
          <Picker onEmojiClick={() => {}} />
        </div>
      </VWSContainer>
    );
  }
}

export default Emoji;
