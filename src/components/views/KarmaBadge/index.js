import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";

import { faRocket } from "@fortawesome/pro-duotone-svg-icons/faRocket";
import { faMedal } from "@fortawesome/pro-solid-svg-icons/faMedal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../containers/Container";

function KarmaBadge({ noOnClick, onClick, noTooltip, userBasicInfo }) {
  const navigate = useNavigate();

  const [karma, setKarma] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    import("../../../util").then((functions) => {
      setKarma(functions.calculateKarma(userBasicInfo));
    });
    setIsAdmin(userBasicInfo ? userBasicInfo.is_admin : false);
  }, [userBasicInfo, userBasicInfo.is_admin]);

  if (isAdmin)
    return (
      <Tooltip
        placement="bottom"
        title={noTooltip ? "" : karma + " Karma Points"}
      >
        <span>
          <Container
            className="clickable"
            onClick={(e) => {
              if (noOnClick) return;
              e.stopPropagation();
              e.preventDefault();

              if (onClick) onClick();
              else {
                navigate("/site-info");
              }
            }}
          >
            <h5 className="bg-blue white fw-400 px8 py4 br8">Moderator</h5>
          </Container>
        </span>
      </Tooltip>
    );

  let badgeColor;
  let badgeIcon;
  if (karma >= 10000) {
    badgeColor = "#0062ff";
    badgeIcon = faRocket;
  } else if (karma >= 5000) {
    badgeColor = "#06ac4b";
    badgeIcon = faRocket;
  } else if (karma >= 2500) {
    badgeColor = "#FF101F";
    badgeIcon = faRocket;
  } else if (karma >= 1000) {
    badgeColor = "#ff5100";
    badgeIcon = faRocket;
  } else if (karma >= 500) {
    badgeColor = "#66a1ff";
    badgeIcon = faMedal;
  } else if (karma >= 250) {
    badgeColor = "#07c556";
    badgeIcon = faMedal;
  } else if (karma >= 100) {
    badgeColor = "#ff6670";
    badgeIcon = faMedal;
  } else if (karma >= 50) {
    badgeColor = "#ff9666";
    badgeIcon = faMedal;
  }

  if (badgeColor && badgeIcon)
    return (
      <Tooltip
        placement="bottom"
        title={noTooltip ? "" : karma + " Karma Points"}
      >
        <span>
          <Container
            className="clickable"
            onClick={(e) => {
              if (noOnClick) return;
              e.stopPropagation();
              e.preventDefault();

              if (onClick) onClick();
              else {
                navigate("/site-info");
              }
            }}
          >
            <FontAwesomeIcon icon={badgeIcon} color={badgeColor} size="2x" />
          </Container>
        </span>
      </Tooltip>
    );
  else return <div></div>;
}

export default KarmaBadge;
