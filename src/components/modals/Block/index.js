import React from "react";

import Container from "../../containers/Container";

import { isMobileOrTablet } from "../../../util";

function BlockModal({ text, title }) {
  return (
    <Container className="modal-container full-center">
      <Container
        className={
          "modal column align-center ov-auto bg-white br4 " +
          (isMobileOrTablet() ? "mx8" : "container medium")
        }
      >
        <Container className="x-fill justify-center bg-blue py16">
          <h4 className="tac white">{title}</h4>
        </Container>
        <Container className="x-fill column">
          <Container className="x-fill full-center py16 px32">{text}</Container>
        </Container>
      </Container>
      <Container className="modal-background" />
    </Container>
  );
}

export default BlockModal;
