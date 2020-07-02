import React, { Component } from "react";
import Container from "../containers/Container";
import Text from "../views/Text";

import "./style.css";

class SuccessMessage extends Component {
  render() {
    const { id, text } = this.props;

    return (
      <div
        className="success-message absolute left-0 shadow-2 bg-white px16 py8 br4"
        style={{
          display: "none",
          top: "calc(100% + 8px)",
          whiteSpace: "nowrap"
        }}
      >
        <Text id={id} text={text} type="h6" />
      </div>
    );
  }
}

export default SuccessMessage;
