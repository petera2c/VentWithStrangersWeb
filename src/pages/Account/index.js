import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AdSense from "react-adsense";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../../context";

import Account from "./Account";
import Avatar from "./Avatar";
import Profile from "./Profile";
import Settings from "./Settings";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";

import { isMobileOrTablet, isPageActive, signOut } from "../../util";

function AccountPage() {
  const { user, userSubscription } = useContext(UserContext);
  const navigate = useNavigate();

  const location = useLocation();
  let { pathname, search } = location;

  useEffect(() => {
    if (
      (pathname === "/account" ||
        pathname === "/settings" ||
        pathname === "/avatar") &&
      !user
    )
      navigate("/");
  }, [user]);

  return (
    <Page className="bg-grey-2" description="" keywords="" title="Account">
      <Container className={isMobileOrTablet() ? "x-fill pt16" : ""}>
        {user && pathname === "/account" && <Account user={user} />}
        {user && pathname === "/avatar" && <Avatar user={user} />}
        {pathname === "/profile" && <Profile user={user} />}
        {user && pathname === "/settings" && <Settings user={user} />}
      </Container>
    </Page>
  );
}

export default AccountPage;
