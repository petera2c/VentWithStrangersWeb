import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Space } from "antd";

import Page from "../../components/containers/Page";

import { UserContext } from "../../context";

import { getIsUserSubscribed } from "../util";

function SubscriptionSuccessPage() {
  const { user, setUserSubscription } = useContext(UserContext);

  useEffect(() => {
    getIsUserSubscribed(setUserSubscription, user.uid);
  }, []);

  return (
    <Page className="bg-grey-2 align-center" title="Success">
      <Space className="column container large full-center bg-white pa32 ma32 br8">
        <h1>Subscription Successful!</h1>
        <p>We are so thankful that you joined a paid plan :)</p>
        <Link to="/">
          <Button size="large" type="primary">
            Go Home
          </Button>
        </Link>
      </Space>
    </Page>
  );
}

export default SubscriptionSuccessPage;
