import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import Consumer, { ExtraContext } from "../../context";

import { capitolizeFirstChar, isPageActive } from "../../util";

class AccountPage extends Component {
  componentDidMount() {
    const { location } = this.props;
    let search = { location };
    search = location.search.slice(1, search.length);
  }
  render() {
    const { location } = this.props;
    const { pathname } = location;
    return (
      <Consumer>
        {context => (
          <Page
            className="justify-center align-start bg-grey py32"
            description=""
            keywords=""
            title="Account"
          >
            <Container className="x-25 column align-center bg-white br8">
              <Container className="clickable x-fill align-center border-bottom pa16">
                <Text
                  className={"button-3 " + isPageActive("/account", pathname)}
                  text="Account"
                  type="p"
                />
              </Container>
              <Container className="clickable x-fill align-center border-bottom pa16">
                <Text
                  className={"button-3 " + isPageActive("/activity", pathname)}
                  text="Activity"
                  type="p"
                />
              </Container>
              <Container className="clickable x-fill align-center border-bottom pa16">
                <Text
                  className={"button-3 " + isPageActive("/settings", pathname)}
                  text="Settings"
                  type="p"
                />
              </Container>
              <Container className="clickable x-fill align-center pa16">
                <Text className="button-1" text="Sign Out" type="p" />
              </Container>
            </Container>
          </Page>
        )}
      </Consumer>
    );
  }
}

AccountPage.contextType = ExtraContext;

export default withRouter(AccountPage);
