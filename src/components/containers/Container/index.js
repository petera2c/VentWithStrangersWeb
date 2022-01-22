import React from "react";

function Container({
  children,
  className,
  forwardedRef,
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
      ref={forwardedRef}
      style={style}
    >
      {children}
    </div>
  );
}

export default Container;
