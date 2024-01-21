import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Space } from "antd";

import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons/faBirthdayCake";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../containers/Container";

import { useIsMounted } from "../../../util";
import useIsMobile from "../../../hooks/useIsMobile";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

function BirthdayModal({ close }: any) {
  const isMounted = useIsMounted();
  const isMobile = useIsMobile();

  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (isMounted()) setCanClose(true);
    }, 2000);
  }, [isMounted]);

  return (
    <Container
      className="modal-container full-center"
      onClick={() => {
        if (canClose) close();
      }}
    >
      <Container
        className={
          "modal column align-center ov-auto bg-white pa32 br8 " +
          (isMobile ? "mx8" : "container medium")
        }
      >
        <Space className="column x-fill" size="large">
          <Container className="column">
            <h1 className="blue tac">Happy Birthday!</h1>
            <h4 className="tac">
              We are so happy to celebrate this special day with you!
            </h4>
          </Container>
          <Link to="/birthday-post">
            <Button onClick={close} size="large" type="primary">
              Create Birthday Post
            </Button>
          </Link>
          <Space>
            <FontAwesomeIcon
              className="blue"
              icon={faBirthdayCake as IconProp}
              size="5x"
            />
            <FontAwesomeIcon
              className="purple"
              icon={faBirthdayCake as IconProp}
              size="5x"
            />
            <FontAwesomeIcon
              className="orange"
              icon={faBirthdayCake as IconProp}
              size="5x"
            />
            <FontAwesomeIcon
              className="red"
              icon={faBirthdayCake as IconProp}
              size="5x"
            />
            <FontAwesomeIcon
              className="green"
              icon={faBirthdayCake as IconProp}
              size="5x"
            />
          </Space>
        </Space>
      </Container>
      <Container className="modal-background" />
    </Container>
  );
}

export default BirthdayModal;
