import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AdSense from "react-adsense";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faUserAstronaut } from "@fortawesome/pro-duotone-svg-icons/faUserAstronaut";

import { UserContext } from "../../context";

import Account from "./Account";
import Avatar from "./Avatar";
import Profile from "./profile";
import Settings from "./Settings";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import { isMobileOrTablet, isPageActive, signOut } from "../../util";

function AccountPage() {
  const user = useContext(UserContext);

  const location = useLocation();
  let { pathname, search } = location;

  return (
    <Page className="bg-grey-2" description="" keywords="" title="Account">
      <Container
        className={
          "x-fill align-start justify-center " +
          (isMobileOrTablet() ? "py16" : "py32")
        }
      >
        {!isMobileOrTablet() && !search && (
          <Container className="container small column">
            <Container className="column align-center bg-white px16 mb16 br8">
              <Link className="x-fill" to={"/profile" + search}>
                <Container
                  className={
                    "grid-1 button-4 clickable x-fill align-center py16" +
                    isPageActive("/profile", pathname)
                  }
                >
                  <Container className="flex x-fill full-center">
                    <FontAwesomeIcon icon={faChartNetwork} />
                  </Container>
                  <Text text="Public Profile" type="h5" />
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
              <Link className="x-fill" to="/avatar">
                <Container
                  className={
                    "grid-1 button-4 clickable x-fill align-center py16" +
                    isPageActive("/avatar", pathname)
                  }
                >
                  <Container className="flex x-fill full-center">
                    <FontAwesomeIcon icon={faUserAstronaut} />
                  </Container>
                  <Text text="Avatar" type="h5" />
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
            <AdSense.Google
              className="adsbygoogle"
              client="ca-pub-5185907024931065"
              format=""
              responsive="true"
              slot="1591936277"
              style={{
                display: "block",
                minWidth: "100px",
                width: "100%",
                maxWidth: "500px",
                minHeight: "100px",
                height: "400px",
                maxHeight: "1200px"
              }}
            />
          </Container>
        )}

        <Container className={isMobileOrTablet() ? "x-fill pt16" : "pl32"}>
          {pathname === "/account" && <Account user={user} />}
          {pathname === "/avatar" && <Avatar user={user} />}
          {pathname === "/profile" && <Profile user={user} />}
          {pathname === "/settings" && <Settings user={user} />}
        </Container>
      </Container>
    </Page>
  );
}

export default AccountPage;
