import React, { useState } from "react";
import Picker from "emoji-picker-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmileBeam } from "@fortawesome/free-regular-svg-icons/faSmileBeam";

import Container from "../containers/Container";

import Button from "../views/Button";

function Emoji({ handleChange }) {
  const [displayEmojiDropdown, setDisplayEmojiDropdown] = useState(false);

  return (
    <Container className="column relative pa8 mx8">
      <Button onClick={() => setDisplayEmojiDropdown(!displayEmojiDropdown)}>
        <FontAwesomeIcon className="grey-5" icon={faSmileBeam} />
      </Button>
      <div
        style={{
          position: "absolute",
          top: "100%",
          right: 0,
          display: displayEmojiDropdown ? "" : "none"
        }}
      >
        <Picker
          onEmojiClick={(event, emojiObject) => {
            setDisplayEmojiDropdown(false);
            handleChange(emojiObject.emoji);
          }}
        />
      </div>
    </Container>
  );
}

export default Emoji;
