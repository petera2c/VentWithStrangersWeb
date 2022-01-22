import React from "react";

function Button({
  children,
  className,
  name,
  onClick = () => {},
  style,
  text,
  type,
}) {
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

export default Button;
