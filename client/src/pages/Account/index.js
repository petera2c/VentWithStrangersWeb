import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import Consumer, { ExtraContext } from "../../context";

import Account from "./Account";
import Activity from "./Activity";
import Settings from "./Settings";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import { isMobileOrTablet, isPageActive, signOut } from "../../util";

class AccountPage extends Component {
  componentDidMount() {
    const { history, location } = this.props;
    const { user } = this.context;

    let search = { location };
    search = location.search.slice(1, search.length);

    if (!search && !user.password) history.push("/");
  }

  render() {
    const { location } = this.props;
    const { pathname, search } = location;

    return (
      <Consumer>
        {context => (
          <Page
            className="justify-start align-center bg-grey"
            description=""
            keywords=""
            title="Account"
          >
            <Container className="align-start py32">
              {!isMobileOrTablet() && !search && (
                <Container className="x-25 column align-center bg-white px16 br8">
                  <Link className="x-fill" to={"/activity" + search}>
                    <Container
                      className={
                        "grid-1 button-4 clickable x-fill align-center py16" +
                        isPageActive("/activity", pathname)
                      }
                    >
                      <Container className="flex x-fill full-center">
                        <FontAwesomeIcon icon={faChartNetwork} />
                      </Container>
                      <Text text="Activity" type="h5" />
                    </Container>
                  </Link>

                  <Link className="x-fill" to="/account">
                    <Container
                      className={
                        "grid-1 button-4 clickable x-fill align-center py16" +
                        isPageActive("/account", pathname)
                      }
                    >
                      <Container className="flex x-fill full-center">
                        <FontAwesomeIcon icon={faUser} />
                      </Container>
                      <Text text="Account" type="h5" />
                    </Container>
                  </Link>

                  <Link className="x-fill" to="/settings">
                    <Container
                      className={
                        "grid-1 button-4 clickable x-fill align-center py16" +
                        isPageActive("/settings", pathname)
                      }
                    >
                      <Container className="flex x-fill full-center">
                        <FontAwesomeIcon icon={faCog} />
                      </Container>
                      <Text text="Settings" type="h5" />
                    </Container>
                  </Link>

                  <Container className="clickable x-fill align-center pa16">
                    <Text
                      className="button-1"
                      onClick={signOut}
                      text="Sign Out"
                      type="h5"
                    />
                  </Container>
                </Container>
              )}
              <Container className={isMobileOrTablet() ? "" : "pl32"}>
                {pathname === "/account" && <Account />}
                {pathname === "/activity" && <Activity />}
                {pathname === "/settings" && <Settings />}
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
