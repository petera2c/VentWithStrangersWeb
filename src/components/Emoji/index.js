import React, { useState } from "react";
//import loadable from "@loadable/component";
import { Picker } from "emoji-mart";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmileBeam } from "@fortawesome/pro-regular-svg-icons/faSmileBeam";

import HandleOutsideClick from "../containers/HandleOutsideClick";

//const { Picker } = loadable(() => import("emoji-mart"));

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
      <button onClick={() => setDisplayEmojiDropdown(!displayEmojiDropdown)}>
        <FontAwesomeIcon className="grey-5" icon={faSmileBeam} />
      </button>
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
