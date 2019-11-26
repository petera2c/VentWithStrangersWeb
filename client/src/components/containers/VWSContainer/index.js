import React, { Component } from "react";

import "./style.css";

class Container extends Component {
  render() {
    const { children, forwardedRef, id, onClick, style, testMode } = this.props; // Variables
    let { className } = this.props;

    if (testMode) className += " test-mode";

    return (
      <div
        className={`main-container light-scrollbar ${className}`}
        id={id}
        onClick={onClick}
        ref={forwardedRef}
        style={style}
      >
        {children}
      </div>
    );
  }
}

export default Container;
