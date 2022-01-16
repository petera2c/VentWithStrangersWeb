import React, { useContext, useEffect, useState } from "react";
import moment from "moment-timezone";
import { Space } from "antd";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import { useIsMounted } from "../../util";
import {
  calculateMilestone,
  getNextMilestone,
  getUserRecentRewards,
  getUserRewardsProgress,
} from "./util";

function CounterDisplay({ counter, size, title }) {
  return (
    <Space direction="vertical">
      <Space align="center">
        <h4>
          {counter}/{getNextMilestone(counter, size)}
        </h4>
        <h6 className="blue">{title}</h6>
      </Space>
      <p style={{ lineHeight: 1.25 }}>
        Your next milestone will award you
        <span className="">
          {" "}
          {calculateMilestone(counter, size)} Karma Points
        </span>
      </p>
    </Space>
  );
}

function RewardsPage() {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);

  const [userRewards, setUserRewards] = useState({});
  const [recentRewards, setRecentRewards] = useState([]);

  useEffect(() => {
    if (user) {
      getUserRecentRewards(isMounted, setRecentRewards, user.uid);
      getUserRewardsProgress(isMounted, setUserRewards, user.uid);
    }
  }, []);

  console.log(userRewards);

  return (
    <Page
      className="pa16"
      description="Make friends and earn some awesome rewards!"
      title="Rewards"
    >
      <Container>
        <Space direction="vertical">
          <Space
            align="start"
            className="x-fill bg-white pa32 br8"
            size="large"
          >
            <Space className="flex-fill" direction="vertical" size="large">
              <CounterDisplay
                counter={userRewards.created_vents_counter}
                size="small"
                title="Total Vents Created"
              />
              <CounterDisplay
                counter={userRewards.created_comments_counter}
                size="small"
                title="Total Comments Created"
              />
              <CounterDisplay
                counter={userRewards.created_vent_supports_counter}
                size="medium"
                title="Total Vents You Supported"
              />
            </Space>
            <Space className="flex-fill" direction="vertical" size="large">
              <CounterDisplay
                counter={userRewards.created_comment_supports_counter}
                size="medium"
                title="Total Comments You Supported"
              />
              <CounterDisplay
                counter={userRewards.received_comment_supports_counter}
                size="medium"
                title="Total Comment Supports Received"
              />
              <CounterDisplay
                counter={userRewards.received_vent_supports_counter}
                size="medium"
                title="Total Vent Supports Received"
              />
            </Space>
          </Space>
          <Container
            className="column flex-fill gap8"
            direction="vertical"
            size="large"
          >
            <h1>Recent Rewards</h1>
            {recentRewards.map((obj, index) => (
              <Container className="column x-fill bg-white pa16 br8">
                <h6>{obj.title}</h6>
                <p className="blue">+ {obj.karma_gained} Karma Points</p>
                <p>{moment(obj.server_timestamp).fromNow()}</p>
              </Container>
            ))}
          </Container>
        </Space>
        <SubscribeColumn uniqueShareLink slot="1420086439" />
      </Container>
    </Page>
  );
}

export default RewardsPage;
