import React, { Component } from "react";

import "./style.css";

class Input extends Component {
  render() {
    const {
      autoCapitalize,
      autoCorrect,
      checked,
      className,
      defaultChecked,
      id,
      min,
      max,
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
        checked={checked}
        className={className}
        defaultChecked={defaultChecked}
        id={id}
        min={min}
        max={max}
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

export default Input;
