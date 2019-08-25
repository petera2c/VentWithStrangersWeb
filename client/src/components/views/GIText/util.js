import React from "react";

export const getHtmlElement = props => {
  let { className } = props;
  const { children, onClick, style, testMode, text, title, type } = props;

  if (testMode) className += " text-test-mode";

  if (type === "h1") {
    return (
      <h1 className={className} onClick={onClick} style={style} title={title}>
        {children}
        {text}
      </h1>
    );
  } else if (type === "h2") {
    return (
      <h2 className={className} onClick={onClick} style={style} title={title}>
        {children}
        {text}
      </h2>
    );
  } else if (type === "h3") {
    return (
      <h3 className={className} onClick={onClick} style={style} title={title}>
        {children}
        {text}
      </h3>
    );
  } else if (type === "h4") {
    return (
      <h4 className={className} onClick={onClick} style={style} title={title}>
        {children}
        {text}
      </h4>
    );
  } else if (type === "h5") {
    return (
      <h5 className={className} onClick={onClick} style={style} title={title}>
        {children}
        {text}
      </h5>
    );
  } else if (type === "h6") {
    return (
      <h6 className={className} onClick={onClick} style={style} title={title}>
        {children}
        {text}
      </h6>
    );
  } else if (type === "p") {
    return (
      <p className={className} onClick={onClick} style={style} title={title}>
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
      <span className={className} onClick={onClick} style={style} title={title}>
        {children}
        {text}
      </span>
    );
  }
};
