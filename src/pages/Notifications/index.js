import React, { useContext, useEffect, useRef, useState } from "react";
import loadable from "@loadable/component";

import { UserContext } from "../../context";

import { getNotifications } from "../../components/Header/util";

const Container = loadable(() =>
  import("../../components/containers/Container")
);
const NotificationList = loadable(() =>
  import("../../components/NotificationList")
);
const Page = loadable(() => import("../../components/containers/Page"));

function NotificationsPage() {
  const isMounted = useRef(false);
  const { user } = useContext(UserContext);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    isMounted.current = true;
    import("../../util").then((functions) => {
      setIsMobileOrTablet(functions.getIsMobileOrTablet());
    });

    let newNotificationsListenerUnsubscribe;

    newNotificationsListenerUnsubscribe = getNotifications(
      isMounted,
      setNotifications,
      user
    );

    //readNotifications(notifications);

    return () => {
      isMounted.current = false;
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
