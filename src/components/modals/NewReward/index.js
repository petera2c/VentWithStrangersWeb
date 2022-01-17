import React from "react";
import { Space } from "antd";

import { faComet } from "@fortawesome/pro-duotone-svg-icons/faComet";
import { faMeteor } from "@fortawesome/pro-duotone-svg-icons/faMeteor";
import { faStarShooting } from "@fortawesome/pro-duotone-svg-icons/faStarShooting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../../components/containers/Container";

import { isMobileOrTablet } from "../../../util";

function NewRewardModal({ close, newReward }) {
  return (
    <Container
      className="modal-container full-center"
      onClick={(e) => {
        close();
      }}
    >
      <Container
        className={
          "modal column align-center ov-auto bg-white pa32 br8 " +
          (isMobileOrTablet() ? "mx8" : "container medium")
        }
      >
        <Space className="column x-fill" size="large">
          <Container className="column">
            <h1 className="blue tac">Congratulations!</h1>
            <h4 className="tac">{newReward.title}</h4>
            <p className="blue tac">+ {newReward.karma_gained} Karma Points</p>
          </Container>
          <Space>
            <FontAwesomeIcon className="blue" icon={faComet} size="5x" />
            <FontAwesomeIcon className="blue" icon={faMeteor} size="5x" />
            <FontAwesomeIcon className="blue" icon={faStarShooting} size="5x" />
          </Space>
        </Space>
      </Container>
      <Container className="modal-background" />
    </Container>
  );
}

export default NewRewardModal;
