import React from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal } from "@fortawesome/pro-solid-svg-icons/faMedal";

import Container from "../containers/Container";

import { calculateKarma } from "../../util";

function KarmaBadge({ noOnClick, userBasicInfo }) {
  const navigate = useNavigate();

  const karma = calculateKarma(userBasicInfo);
  const isAdmin = userBasicInfo ? userBasicInfo.is_admin : false;

  let karmaColor = "";

  if (isAdmin)
    return (
      <Tooltip placement="bottom" title={karma + " Karma Points"}>
        <span>
          <Container
            className="clickable"
            onClick={(e) => {
              if (noOnClick) return;
              e.stopPropagation();
              e.preventDefault();

              navigate("/site-info");
            }}
          >
            <h5 className="bg-blue white fw-400 px8 py4 br8">Moderator</h5>
          </Container>
        </span>
      </Tooltip>
    );

  if (karma >= 10000) karmaColor = "#10BEBC";
  else if (karma >= 5000) karmaColor = "#269400";
  else if (karma >= 2500) karmaColor = "#FF0022";
  else if (karma >= 1000) karmaColor = "#F85E00";
  else if (karma >= 500) karmaColor = "#9bf6ff";
  else if (karma >= 250) karmaColor = "#caffbf";
  else if (karma >= 100) karmaColor = "#ffadad";
  else if (karma >= 50) karmaColor = "#ffd6a5";

  if (karmaColor)
    return (
      <Tooltip placement="bottom" title={karma + " Karma Points"}>
        <span>
          <Container
            className="clickable"
            onClick={(e) => {
              if (noOnClick) return;

              e.stopPropagation();
              e.preventDefault();
              navigate("/site-info");
            }}
          >
            <FontAwesomeIcon icon={faMedal} color={karmaColor} size="2x" />
          </Container>
        </span>
      </Tooltip>
    );
  else return <div></div>;
}

export default KarmaBadge;
