import React from "react";
import moment from "moment-timezone";

import Container from "../containers/Container";
import Text from "../views/Text";

import Button from "../views/Button";

function NotificationList({ notifications }) {
  console.log(notifications);
  return (
    <Container className="column x-fill">
      {notifications.map((notification, index) => {
        return (
          <a
            className={
              "column pa16 " +
              (index !== notifications.length - 1 ? "border-bottom" : "")
            }
            key={index}
            href={notification.link}
          >
            <Text text={notification.message} type="h6" />
            <Text
              text={moment(notification.server_timestamp)
                .subtract(1, "minute")
                .fromNow()}
              type="p"
            />
          </a>
        );
      })}
      {((notifications && notifications.length === 0) || !notifications) && (
        <Container className="full-center">
          <Text
            className="fw-400 pa16"
            text="There are no notifications to show!"
            type="h6"
          />
        </Container>
      )}
    </Container>
  );
}

export default NotificationList;
