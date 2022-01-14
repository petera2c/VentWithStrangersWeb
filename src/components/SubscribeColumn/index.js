import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Space } from "antd";

import Container from "../containers/Container";
import MakeAd from "../MakeAd";

import { UserContext } from "../../context";

import { isMobileOrTablet } from "../../util";

function SubscribeColumn({ slot }) {
  const { user, userSubscription } = useContext(UserContext);
  if (!userSubscription && !isMobileOrTablet())
    return (
      <Container className="container ad column pl16">
        <Container className="sticky top-0 column x-fill">
          {user && (
            <Space
              className="x-fill full-center bg-white pa16 mb16 br8"
              direction="vertical"
            >
              <h4 className="tac">Become a Subscriber</h4>
              <p className="tac">
                Vent With Strangers needs your help. Support our team to build
                the application our community needs. Please consider
                subscribing.
              </p>
              <Link to="/subscribe">
                <Button size="large" type="primary">
                  Subscribe For $1/Month
                </Button>
              </Link>
            </Space>
          )}
          <MakeAd
            className="mt16"
            slot={slot}
            userSubscription={userSubscription}
          />
        </Container>
      </Container>
    );
  else return <div style={{ display: "none" }} />;
}

export default SubscribeColumn;
