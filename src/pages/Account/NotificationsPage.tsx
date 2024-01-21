import { useContext, useEffect, useState } from "react";
import { Button } from "antd";

import Container from "../../components/containers/Container";
import NotificationList from "../../components/NotificationList";
import Page from "../../components/containers/Page/Page";

import { UserContext } from "../../context";

import {
  getNotifications,
  newNotificationsListener,
} from "../../components/Header/util";
import { useIsMounted } from "../../util";

const NotificationsPage = () => {
  const isMounted = useIsMounted();
  // @ts-ignore
  const { user } = useContext(UserContext);

  const [canShowLoadMore, setCanShowLoadMore] = useState(true);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isMounted()) let newNotificationsListenerUnsubscribe;

    getNotifications(
      isMounted,
      [],
      setCanShowLoadMore,
      undefined,
      setNotifications,
      user
    );
    newNotificationsListenerUnsubscribe = newNotificationsListener(
      isMounted,
      undefined,
      setNotifications,
      user
    );

    return () => {
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
    };
  }, [isMounted, user]);

  return (
    <Page
      className="justify-start align-center bg-blue-2 pa16"
      description=""
      keywords=""
      title="Notifications"
    >
      <Container
        className={
          "column ov-visible gap16 " + (isMobile ? "" : "container large")
        }
      >
        <Container className="full-center bg-white ov-hidden br8 pa32">
          <h1 className="fw-600 tac">Notifications</h1>
        </Container>
        <Container className="bg-white ov-hidden br8">
          <NotificationList notifications={notifications} />
        </Container>
        {canShowLoadMore && (
          <Button
            onClick={() =>
              getNotifications(
                isMounted,
                notifications,
                setCanShowLoadMore,
                undefined,
                setNotifications,
                user
              )
            }
            size="large"
            type="primary"
          >
            Load More
          </Button>
        )}
      </Container>
    </Page>
  );
};

export default NotificationsPage;
