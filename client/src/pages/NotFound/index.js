import React, { Component } from "react";
import { Link } from "react-router-dom";

import Page from "../../components/containers/Page";
import VWSContainer from "../../components/containers/VWSContainer";
import VWSText from "../../components/views/VWSText";

import Consumer, { ExtraContext } from "../../context";

class NotFoundPage extends Component {
  render() {
    return (
      <Consumer>
        {context => (
          <Page
            className="column align-center bg-grey py32"
            description="Home"
            keywords=""
            title="Home"
          >
            <VWSText className="mb16" text="Page Not Found" type="h1" />
          </Page>
        )}
      </Consumer>
    );
  }
}

export default NotFoundPage;
