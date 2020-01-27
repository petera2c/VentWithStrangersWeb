import React, { Component } from "react";
import { Link } from "react-router-dom";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import Consumer, { ExtraContext } from "../../context";

class NotFoundPage extends Component {
  render() {
    return (
      <Consumer>
        {context => (
          <Page
            className="column align-center bg-grey-2 py32"
            description="Home"
            keywords=""
            title="Home"
          >
            <Text className="mb16" text="Page Not Found" type="h1" />
          </Page>
        )}
      </Consumer>
    );
  }
}

export default NotFoundPage;
