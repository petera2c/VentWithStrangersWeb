import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal } from "@fortawesome/pro-solid-svg-icons/faMedal";

function KarmaBadge({ karma }) {
  const title =
    "Karma Badges are awarded based on Karma Points. Get Karma Points when your Vent or comment gets upvoted or when you upvote a Vent or comment. Lose Karma points if you get reported for a valid reason.";
  let karmaColor = "";
  if (karma >= 5000)
    return (
      <h5 className="bg-blue white fw-400 px8 py4 br8" title={title}>
        Moderator
      </h5>
    );
  else if (karma >= 500) karmaColor = "#9bf6ff";
  else if (karma >= 250) karmaColor = "#caffbf";
  else if (karma >= 100) karmaColor = "#ffadad";
  else if (karma >= 50) karmaColor = "#ffd6a5";

  if (karmaColor)
    return (
      <FontAwesomeIcon
        icon={faMedal}
        color={karmaColor}
        size="2x"
        title={title}
      />
    );
  else return <div></div>;
}

export default KarmaBadge;
