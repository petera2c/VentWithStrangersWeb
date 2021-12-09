import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Container from "../../containers/Container";
import Text from "../../views/Text";
import Button from "../../views/Button";

class ConfirmAlertModal extends Component {
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };
  render() {
    const { close, message, submit, title } = this.props; // Functions

    return (
      <Container className="modal-container full-center normal-cursor">
        <Container className="modal container medium column ov-auto bg-white br4">
          <Container className="x-fill justify-center bg-grey-10 py16">
            <Text className="grey-11 tac" text={title} type="h4" />
          </Container>
          <Container className="column x-fill pa16">
            <Text className="tac bold mb16" text={message} type="h5" />
          </Container>
          <Container className="full-center border-top pa16">
            <Button
              className="grey-1 border-all py8 px32 mx4 br4"
              text="Cancel"
              onClick={() => close()}
            />
            <Button
              className="button-2 py8 px32 mx4 br4"
              text="Submit"
              onClick={() => {
                submit();
                close();
              }}
            />
          </Container>
        </Container>
        <Container className="modal-background" onClick={close} />
      </Container>
    );
  }
}

export default withRouter(ConfirmAlertModal);
