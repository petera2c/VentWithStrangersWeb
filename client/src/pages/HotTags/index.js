import React, { Component } from "react";
import { Link } from "react-router-dom";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import Consumer, { ExtraContext } from "../../context";

import HotTags from "../../components/HotTags";

import { isMobileOrTablet } from "../../util";

class HotTagsPage extends Component {
  render() {
    return (
      <Consumer>
        {context => (
          <Page
            className="column x-fill align-center px16 bg-grey-2 py32"
            description="Home"
            keywords=""
            title="Home"
          >
            <Container
              className={
                "column " +
                (isMobileOrTablet()
                  ? "container mobile-full px16"
                  : "container large")
              }
            >
              <Text className="primary fs-20 mb16" text="Tags" type="h1" />
              <HotTags />
            </Container>
          </Page>
        )}
      </Consumer>
    );
  }
}

export default HotTagsPage;
