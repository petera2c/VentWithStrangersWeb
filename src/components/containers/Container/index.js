import React from "react";

function Container({
  children,
  className,
  forwardedRef2,
  id,
  onClick,
  onScroll,
  style,
  testMode,
}) {
  if (testMode) className += " test-mode";

  return (
    <div
      className={`main-container light-scrollbar ${className}`}
      id={id}
      onClick={onClick}
      onScroll={onScroll}
      ref={forwardedRef2}
      style={style}
    >
      {children}
    </div>
  );
}

export default Container;
