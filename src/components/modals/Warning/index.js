import React, { Component } from "react";

import Consumer from "../../../context";

import Container from "../../containers/Container";
import Text from "../../views/Text";
import Button from "../../views/Button";

function LoginPage({ close }) {
  return (
    <Consumer>
      {(context) => (
        <Container className="modal-container full-center">
          <Container className="modal container medium column align-center ov-auto bg-white br4">
            <Container className="x-fill justify-center bg-blue py16">
              <Text className="tac white" text="Warning!" type="h4" />
            </Container>
            <Container className="x-fill column">
              <Container className="x-fill full-center px32">
                <Text className="x-fill tac py16" type="p">
                  If you create a Vent without signing in, you will not be able
                  to receive notifications, edit, or delete this post!
                </Text>
              </Container>
            </Container>
          </Container>
          <Container className="modal-background" onClick={close} />
        </Container>
      )}
    </Consumer>
  );
}

export default LoginPage;
