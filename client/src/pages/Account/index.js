import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import Account from "./Account";
import Activity from "./Activity";
import Settings from "./Settings";

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
    const { pathname, search } = location;

    return (
      <Consumer>
        {context => (
          <Page
            className="justify-center align-start bg-grey py32"
            description=""
            keywords=""
            title="Account"
          >
            <Container className="x-25 column align-center bg-white px16 br8">
              <Link className="x-fill" to={"/account" + search}>
                <Container
                  className={
                    "test2 button-4 clickable x-fill align-center border-bottom py16" +
                    isPageActive("/account", pathname)
                  }
                >
                  <Container className="flex x-fill full-center">
                    <FontAwesomeIcon icon={faUser} />
                  </Container>
                  <Text text="Account" type="p" />
                </Container>
              </Link>
              <Link className="x-fill" to={"/activity" + search}>
                <Container
                  className={
                    "test2 button-4 clickable x-fill align-center border-bottom py16" +
                    isPageActive("/activity", pathname)
                  }
                >
                  <Container className="flex x-fill full-center">
                    <FontAwesomeIcon icon={faChartNetwork} />
                  </Container>
                  <Text text="Activity" type="p" />
                </Container>
              </Link>
              <Link className="x-fill" to={"/settings" + search}>
                <Container
                  className={
                    "test2 button-4 clickable x-fill align-center border-bottom py16" +
                    isPageActive("/settings", pathname)
                  }
                >
                  <Container className="flex x-fill full-center">
                    <FontAwesomeIcon icon={faCog} />
                  </Container>
                  <Text text="Settings" type="p" />
                </Container>
              </Link>

              <Container className="clickable x-fill align-center pa16">
                <Text className="button-1" text="Sign Out" type="p" />
              </Container>
            </Container>
            <Container className="ml16">
              {pathname === "/account" && <Account />}
              {pathname === "/activity" && <Activity />}
              {pathname === "/settings" && <Settings />}
            </Container>
          </Page>
        )}
      </Consumer>
    );
  }
}

AccountPage.contextType = ExtraContext;

export default withRouter(AccountPage);
