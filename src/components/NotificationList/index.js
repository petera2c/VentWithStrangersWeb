import React from "react";
import moment from "moment-timezone";
import { Link } from "react-router-dom";

import Container from "../containers/Container";

function NotificationList({ notifications }) {
  return (
    <Container className="column x-fill">
      {notifications.map((notification, index) => {
        return (
          <Link
            className={
              "column grey-1 pa16 " +
              (index !== notifications.length - 1 ? "border-bottom" : "")
            }
            key={index}
            to={notification.link}
          >
            <h6>{notification.message}</h6>
            <p className="grey-1 inherit-color">
              {moment(notification.server_timestamp).fromNow()}
            </p>
          </Link>
        );
      })}
      {((notifications && notifications.length === 0) || !notifications) && (
        <Container className="full-center">
          <h6 className="fw-400 pa16">There are no notifications to show!</h6>
        </Container>
      )}
    </Container>
  );
}

export default NotificationList;
