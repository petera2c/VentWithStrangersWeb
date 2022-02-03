import React, { useContext, useEffect, useState } from "react";

import Container from "../../components/containers/Container";
import NotificationList from "../../components/NotificationList";
import Page from "../../components/containers/Page";

import { UserContext } from "../../context";

import {
  getNotifications,
  readNotifications,
} from "../../components/Header/util";
import { getIsMobileOrTablet, useIsMounted } from "../../util";

function NotificationsPage() {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());

    let newNotificationsListenerUnsubscribe;

    newNotificationsListenerUnsubscribe = getNotifications(
      isMounted,
      notifications,
      () => {},
      setNotifications,
      user
    );
    readNotifications(notifications);

    return () => {
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
    };
  }, [isMounted, user]);

  return (
    <Page
      className="justify-start align-center bg-grey-2"
      description=""
      keywords=""
      title="Notifications"
    >
      <Container
        className={
          "ov-visible column py32 pa16 " +
          (isMobileOrTablet ? "container mobile-full" : "container large")
        }
      >
        <h4 className="fw-600 mb16">Notifications</h4>
        <Container className="bg-white ov-hidden br8">
          <NotificationList notifications={notifications} />
        </Container>
      </Container>
    </Page>
  );
}

export default NotificationsPage;
