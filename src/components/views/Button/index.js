import React, { Component } from "react";

import "./style.css";

class Button extends Component {
  render() {
    const {
      children,
      className,
      name,
      onClick = () => {},
      style,
      text,
      type,
    } = this.props;
    return (
      <button
        onClick={onClick}
        style={style}
        className={className}
        type={type}
        name={name}
      >
        {text}
        {children}
      </button>
    );
  }
}

export default Button;
