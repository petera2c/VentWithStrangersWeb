import React, { Component } from "react";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

class HomePage extends Component {
  render() {
    return (
      <Page
        className="column align-center py32 mt64"
        description="Home"
        keywords=""
        title="Home"
      >
        You are home
      </Page>
    );
  }
}

export default HomePage;
