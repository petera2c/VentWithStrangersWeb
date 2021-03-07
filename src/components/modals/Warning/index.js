import React, { Component } from "react";

import Container from "../../containers/Container";
import Text from "../../views/Text";
import Button from "../../views/Button";

function WarningModal({ close, text }) {
  return (
    <Container className="modal-container full-center">
      <Container className="modal container medium column align-center ov-auto bg-white br4">
        <Container className="x-fill justify-center bg-blue py16">
          <Text className="tac white" text="Warning!" type="h4" />
        </Container>
        <Container className="x-fill column">
          <Container className="x-fill full-center px32">
            <p className="x-fill tac py16">{text}</p>
          </Container>
        </Container>
      </Container>
      <Container className="modal-background" onClick={close} />
    </Container>
  );
}

export default WarningModal;
