import React, { Component } from "react";
import moment from "moment-timezone";

import Consumer from "../../context";

import Container from "../containers/Container";
import Text from "../views/Text";
 
import Button from "../views/Button";

class NotificationList extends Component {
  render() {
    return (
      <Consumer>
        {context => {
          return (
            <Container className="column x-fill">
              {context.notifications.map((notification, index) => {
                return (
                  <a
                    className={
                      "column pa16 " +
                      (index !== context.notifications.length - 1
                        ? "border-bottom"
                        : "")
                    }
                    key={index}
                    href={notification.link}
                  >
                    <Text text={notification.body} type="h6" />
                    <Text
                      text={moment(notification.createdAt)
                        .subtract(1, "minute")
                        .fromNow()}
                      type="p"
                    />
                  </a>
                );
              })}
              {((context.notifications && context.notifications.length === 0) ||
                !context.notifications) && (
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
        }}
      </Consumer>
    );
  }
}

export default NotificationList;
