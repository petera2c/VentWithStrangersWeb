import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/pro-regular-svg-icons/faHeart";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import { isMobileOrTablet } from "../../util";

class MakeFriendsPage extends Component {
  render() {
    return (
      <Page
        className="bg-grey-2 full-center"
        description=""
        keywords="Learn about Vent With Strangers"
        title="Site Info"
      >
        <Container className="column container large bg-white pa32 mt64 mb16 br8">
          <h1 className="primary tac mb16">Make Friends Online</h1>
          <h4 className="grey-1 tac">
            Making friends online has never been better! :) Tell us a little bit
            about yourself and we can help you make friends!
          </h4>
        </Container>
        <Container className="flex-fill column container extra-large bg-white pa32 ma32 br8"></Container>
      </Page>
    );
  }
}

export default MakeFriendsPage;
