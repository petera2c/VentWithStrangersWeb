import React, { useState } from "react";
import { Picker } from "emoji-mart";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmileBeam } from "@fortawesome/pro-regular-svg-icons/faSmileBeam";

import HandleOutsideClick from "../containers/HandleOutsideClick";

import Button from "../views/Button";

function Emoji({ handleChange, top }) {
  const [displayEmojiDropdown, setDisplayEmojiDropdown] = useState(false);
  let style = {
    position: "absolute",
    top: "100%",
    right: 0,
    display: displayEmojiDropdown ? "" : "none",
    zIndex: 10,
  };

  if (top)
    style = {
      position: "absolute",
      bottom: "100%",
      right: 0,
      display: displayEmojiDropdown ? "" : "none",
      zIndex: 10,
    };

  return (
    <HandleOutsideClick
      className="column relative pa8 mx8"
      close={setDisplayEmojiDropdown}
    >
      <Button onClick={() => setDisplayEmojiDropdown(!displayEmojiDropdown)}>
        <FontAwesomeIcon className="grey-5" icon={faSmileBeam} />
      </Button>
      <div style={style}>
        <Picker
          onSelect={(emojiObject) => {
            setDisplayEmojiDropdown(false);
            handleChange(emojiObject.native);
          }}
        />
      </div>
    </HandleOutsideClick>
  );
}

export default Emoji;
