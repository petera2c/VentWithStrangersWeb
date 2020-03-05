import React, { Component } from "react";
import Consumer from "../../context";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import NotificationList from "../../components/NotificationList";

import LoadingHeart from "../../components/loaders/Heart";

import Text from "../../components/views/Text";

import { isMobileOrTablet } from "../../util";

class NotificationsPage extends Component {
  render() {
    return (
      <Page
        className="justify-start align-center bg-grey-2"
        description=""
        keywords=""
        title="Notifications"
      >
        <Container
          className={
            "ov-visible column py32 " +
            (isMobileOrTablet()
              ? "container mobile-full px16"
              : "container large")
          }
        >
          <Text className="fw-600 mb16" text="Notifications" type="h4" />
          <Container className="bg-white ov-hidden br8">
            <NotificationList />
          </Container>
        </Container>
      </Page>
    );
  }
}

export default NotificationsPage;
