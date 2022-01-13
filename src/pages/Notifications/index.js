import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "../../context";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import NotificationList from "../../components/NotificationList";

import { getNotifications } from "../../components/Header/util";
import { isMobileOrTablet, useIsMounted } from "../../util";

function NotificationsPage() {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let newNotificationsListenerUnsubscribe;

    newNotificationsListenerUnsubscribe = getNotifications(
      isMounted,
      setNotifications,
      user
    );

    //readNotifications(notifications);

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
          (isMobileOrTablet() ? "container mobile-full" : "container large")
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
