import React, { Component } from "react";
import { Link } from "react-router-dom";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import Consumer, { ExtraContext } from "../../context";

import HotTags from "../../components/HotTags";

class NotFoundPage extends Component {
  render() {
    return (
      <Consumer>
        {context => (
          <Page
            className="x-fill px16 bg-grey-2 py32"
            description="Home"
            keywords=""
            title="Home"
          >
            <HotTags />
          </Page>
        )}
      </Consumer>
    );
  }
}

export default NotFoundPage;
