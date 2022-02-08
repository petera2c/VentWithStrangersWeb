import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Space } from "antd";

import Page from "../../../components/containers/Page";

import { UserContext } from "../../../context";
import { getIsUserSubscribed } from "../../util";

function SubscriptionSuccessPage() {
  const isMounted = useRef(false);

  const { user, setUserSubscription } = useContext(UserContext);

  useEffect(() => {
    isMounted.current = true;
    if (user) getIsUserSubscribed(isMounted, setUserSubscription, user.uid);
    return () => {
      isMounted.current = false;
    };
  }, [setUserSubscription, user]);

  return (
    <Page className="bg-blue-2 align-center" title="Success">
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
