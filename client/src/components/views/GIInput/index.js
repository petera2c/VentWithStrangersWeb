import React, { Component } from "react";

import "./style.css";

class GIInput extends Component {
  render() {
    const {
      autoCapitalize,
      autoCorrect,
      className,
      name,
      onChange,
      placeholder,
      required,
      tabIndex,
      type,
      value
    } = this.props;
    return (
      <input
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        className={className}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        tabIndex={tabIndex}
        type={type}
        value={value}
      />
    );
  }
}

export default GIInput;
