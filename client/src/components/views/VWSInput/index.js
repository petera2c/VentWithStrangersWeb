import React, { Component } from "react";

import "./style.css";

class VWSInput extends Component {
  render() {
    const {
      autoCapitalize,
      autoCorrect,
      className,
      id,
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
        id={id}
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

export default VWSInput;
