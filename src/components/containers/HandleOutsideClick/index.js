import React, { useEffect, useRef } from "react";

import Container from "../Container";

function HandleOutsideClickContainer(props) {
  const { children, close } = props;
  const someRef = useRef(null);

  const handleClickOutside = (event) => {
    if (someRef && !someRef.current.contains(event.target)) close();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Container forwardedRef2={someRef} {...props}>
      {children}
    </Container>
  );
}

export default HandleOutsideClickContainer;
