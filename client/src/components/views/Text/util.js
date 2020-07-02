import React from "react";

export const getHtmlElement = props => {
  const { children, text, type } = props;

  if (type === "h1") {
    return (
      <h1 {...props}>
        {children}
        {text}
      </h1>
    );
  } else if (type === "h2") {
    return (
      <h2 {...props}>
        {children}
        {text}
      </h2>
    );
  } else if (type === "h3") {
    return (
      <h3 {...props}>
        {children}
        {text}
      </h3>
    );
  } else if (type === "h4") {
    return (
      <h4 {...props}>
        {children}
        {text}
      </h4>
    );
  } else if (type === "h5") {
    return (
      <h5 {...props}>
        {children}
        {text}
      </h5>
    );
  } else if (type === "h6") {
    return (
      <h6 {...props}>
        {children}
        {text}
      </h6>
    );
  } else if (type === "p") {
    return (
      <p {...props}>
        {children}
        {text}
      </p>
    );
  } else if (type === "label") {
    return (
      <label
        className={className}
        onClick={onClick}
        style={style}
        title={title}
      >
        {children}
        {text}
      </label>
    );
  } else if (type === "span") {
    return (
      <span {...props}>
        {children}
        {text}
      </span>
    );
  }
};
