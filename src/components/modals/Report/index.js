import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Container from "../../containers/Container";
import Text from "../../views/Text";
import Button from "../../views/Button";

class ReportModal extends Component {
  state = {
    abuse: false,
    illegal: false,
    malicious: false,
    option: undefined,
    privateInformation: false,
    violence: false,
    somethingChanged: false
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObj => {
    const stateObj2 = {
      abuse: false,
      illegal: false,
      malicious: false,
      privateInformation: false,
      somethingChanged: true,
      violence: false
    };
    for (let index in stateObj) {
      stateObj2[index] = stateObj[index];
    }
    if (this._ismounted) this.setState(stateObj2);
  };
  render() {
    const { close, submit } = this.props; // Functions
    const {
      abuse,
      illegal,
      malicious,
      option,
      privateInformation,
      violence,
      somethingChanged
    } = this.state;

    return (
      <Container className="modal-container full-center" style={{ zIndex: 10 }}>
        <Container className="modal container medium column ov-auto bg-white br4">
          <Container className="x-fill justify-center bg-grey-10 py16">
            <Text className="grey-11 tac" text="Report Vent" type="h4" />
          </Container>
          <Container className="column x-fill pa16">
            <Text
              className="blue bold mb16"
              text="Reasons for the report"
              type="h6"
            />
            <Container
              className="clickable mb16"
              onClick={() =>
                this.handleChange({
                  option: 1,
                  violence: !violence
                })
              }
            >
              <input
                className="mr8"
                checked={violence}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Threatening or explicit violence"
                type="p"
              />
            </Container>
            <Container
              className="clickable mb16"
              onClick={() =>
                this.handleChange({
                  abuse: !abuse,
                  option: 2
                })
              }
            >
              <input
                className="mr8"
                checked={abuse}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text className="" text="Commits abuse or is harmful" type="p" />
            </Container>
            <Container
              className="clickable mb16"
              onClick={() =>
                this.handleChange({
                  option: 3,
                  privateInformation: !privateInformation
                })
              }
            >
              <input
                className="mr8"
                checked={privateInformation}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Private and personal information"
                type="p"
              />
            </Container>
            <Container
              className="clickable mb16"
              onClick={() =>
                this.handleChange({
                  illegal: !illegal,
                  option: 4
                })
              }
            >
              <input
                className="mr8"
                checked={illegal}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text className="" text="Illegal activities" type="p" />
            </Container>
            <Container
              className="clickable mb16"
              onClick={() =>
                this.handleChange({
                  malicious: !malicious,
                  option: 5
                })
              }
            >
              <input
                className="mr8"
                checked={malicious}
                onChange={() => {}}
                style={{ minWidth: "13px" }}
                type="checkbox"
              />
              <Text
                className=""
                text="Malicious (Phishing, Scam, Spam)"
                type="p"
              />
            </Container>
          </Container>
          {somethingChanged && (
            <Container className="full-center border-top pa16">
              <Button
                className="button-2 py8 px32 mx4 br4"
                text="Submit"
                onClick={() => {
                  submit(option);
                  close();
                }}
              />
            </Container>
          )}
        </Container>
        <Container className="modal-background" onClick={close} />
      </Container>
    );
  }
}

export default withRouter(ReportModal);
