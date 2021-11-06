import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../components/containers/Container";

import { isMobileOrTablet } from "../../util";

function AvatarSection({ user }) {
  useEffect(() => {}, []);
  return (
    <Container
      className={
        "container column px16 " +
        (isMobileOrTablet() ? "mobile-full" : "large")
      }
    >
      <h4 className="mb16">Create Your Avatar</h4>
      <Container className="column bg-white pa16 mb2 br8"></Container>
    </Container>
  );
}

export default AvatarSection;
