import React, { Component } from "react";

import Container from "../containers/Container";

import Button from "../views/Button";
import Text from "../views/Text";

class CookiesComponent extends Component {
  render() {
    const { accept } = this.props;
    return (
      <Container
        className="fixed bottom-0 x-fill bg-white full-center pa16"
        style={{ borderTop: "1px solid var(--main-color)", opacity: 1 }}
      >
        <Container style={{ width: "80%" }}>
          <Text className="primary" type="p">
            Hi there, we use cookies to offer you a better browsing experience
            and to analyze site traffic. By continuing to use our website, you
            consent to the use of these cookies.
          </Text>
          <Button
            className="button-5 px32 br4"
            onClick={accept}
            style={{ whiteSpace: "nowrap" }}
          >
            Got it
          </Button>
        </Container>
      </Container>
    );
  }
}

export default CookiesComponent;
