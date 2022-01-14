import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AdSense from "react-adsense";
import Cookies from "universal-cookie";
import { Button, Space } from "antd";

import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faInfo } from "@fortawesome/pro-duotone-svg-icons/faInfo";
import { faPen } from "@fortawesome/pro-duotone-svg-icons/faPen";
import { faUserFriends } from "@fortawesome/pro-duotone-svg-icons/faUserFriends";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons/faUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../components/containers/Container";
import LoadMore from "../../components/LoadMore";
import NewVentComponent from "../../components/NewVent";
import Page from "../../components/containers/Page";
import Vent from "../../components/Vent";

import { UserContext } from "../../context";

import {
  getTotalOnlineUsers,
  isMobileOrTablet,
  useIsMounted,
} from "../../util";
import { getMetaInformation, getVents } from "./util";

const cookies = new Cookies();

function VentsPage() {
  const isMounted = useIsMounted();
  const { user, userSubscription } = useContext(UserContext);

  const [vents, setVents] = useState(null);
  const location = useLocation();
  const { pathname, search } = location;
  const { metaDescription, metaTitle } = getMetaInformation(pathname);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [totalOnlineUsers, setTotalOnlineUsers] = useState(0);

  useEffect(() => {
    let onlineUsersUnsubscribe;
    setVents(null);

    onlineUsersUnsubscribe = getTotalOnlineUsers((totalOnlineUsers) => {
      if (isMounted()) setTotalOnlineUsers(totalOnlineUsers);
    });

    getVents(isMounted, pathname, setCanLoadMore, setVents, null);

    if (search) {
      const referral = /referral=([^&]+)/.exec(search)[1];
      if (referral) cookies.set("referral", referral);
    }

    return () => {
      if (onlineUsersUnsubscribe) onlineUsersUnsubscribe.off("value");
    };
  }, [isMounted, pathname, search]);

  return (
    <Page
      className="column align-center bg-grey-2"
      description={metaDescription}
      keywords=""
      title={metaTitle}
    >
      <Container
        align="start"
        className={isMobileOrTablet() ? "py16" : "py32"}
        size="large"
      >
        {!isMobileOrTablet() && (
          <Container className="container ad align-start">
            <Space
              className="sticky column x-fill align-start bg-white br8 pa16"
              style={{ top: "96px" }}
            >
              <Link className="button-3 fs-18 mb16" to="/online-users">
                <FontAwesomeIcon className="mr8" icon={faUserFriends} />
                {totalOnlineUsers}{" "}
                {totalOnlineUsers === 1 ? "Person" : "People"} Online
              </Link>
              <Link className="button-3 fs-18 mb16" to="/vent-to-strangers">
                <FontAwesomeIcon className="mr8" icon={faPen} />
                Post a Vent
              </Link>
              <Link className="button-3 fs-18 mb16" to="/conversations">
                <FontAwesomeIcon className="mr8" icon={faComments} />
                Inbox
              </Link>
              <Link className="button-3 fs-18 mb16" to="/make-friends">
                <FontAwesomeIcon className="mr8" icon={faUsers} />
                Make Friends
              </Link>
              <Link className="button-3 fs-18" to="/site-info">
                <FontAwesomeIcon className="ml8 mr16" icon={faInfo} />
                Site Info
              </Link>
            </Space>
            {!userSubscription && process.env.NODE_ENV === "production" && (
              <Container className="x-fill mb8">
                <AdSense.Google
                  className="adsbygoogle"
                  client="ca-pub-5185907024931065"
                  format=""
                  responsive="true"
                  slot="3226323822"
                  style={{
                    display: "block",
                    minWidth: "100px",
                    width: "100%",
                    maxWidth: "1000px",
                    minHeight: "100px",
                    height: "240px",
                    maxHeight: "800px",
                  }}
                />
              </Container>
            )}
          </Container>
        )}
        <Space
          className={
            isMobileOrTablet()
              ? "container mobile-full px8"
              : "container large justify-start px16"
          }
          direction="vertical"
          size="large"
        >
          <NewVentComponent miniVersion />
          <Container className="x-fill">
            <h1 className="primary fs-26">{metaTitle + " Vents"}</h1>
          </Container>

          {vents && (
            <Space className="x-fill" direction="vertical" size="large">
              {vents &&
                vents.map((vent, index) => {
                  return (
                    <Space
                      className="x-fill"
                      direction="vertical"
                      size="middle"
                      key={index}
                    >
                      <Vent previewMode={true} ventInit={vent} />
                      {!userSubscription &&
                        process.env.NODE_ENV === "production" &&
                        index % 3 === 0 && (
                          <Container className="x-fill column">
                            <AdSense.Google
                              className="adsbygoogle"
                              client="ca-pub-5185907024931065"
                              format="fluid"
                              layoutKey="-em+1v+cz-83-96"
                              responsive="true"
                              slot="1835301248"
                              style={{
                                display: "block",
                              }}
                            />
                          </Container>
                        )}
                    </Space>
                  );
                })}
            </Space>
          )}
          {canLoadMore && (
            <LoadMore
              canLoadMore={canLoadMore}
              loadMore={() =>
                getVents(isMounted, pathname, setCanLoadMore, setVents, vents)
              }
            >
              <Container className="bg-red clickable x-fill column bg-white mb16 br8">
                <Container className="justify-between pt16 px32">
                  <Container>
                    <div className="round-icon bg-grey-2 mr8" />
                    <div
                      className=" bg-grey-2 br16"
                      style={{ width: "140px", height: "24px" }}
                    />
                  </Container>
                  <div
                    className="bg-grey-2 br16"
                    style={{ width: "140px", height: "24px" }}
                  />
                </Container>
                <Container className="pt16 px32">
                  <div
                    className="x-fill bg-grey-2 br8"
                    style={{ height: "100px" }}
                  />
                </Container>
                <Container className="py16 px32">
                  <div
                    className=" bg-grey-2 br16"
                    style={{ width: "140px", height: "24px" }}
                  />
                </Container>
              </Container>
            </LoadMore>
          )}

          {vents && vents.length === 0 && (
            <h4 className="fw-400">No vents found.</h4>
          )}
        </Space>

        {!userSubscription && !isMobileOrTablet() && user && (
          <Container className="container ad column">
            <Container
              className="sticky top-0 column x-fill"
              style={{ top: "96px" }}
            >
              <Space
                className="x-fill full-center bg-white pa16 mb16 br8"
                direction="vertical"
              >
                <h4 className="tac">Become a Subscriber</h4>
                <p className="tac">
                  Vent With Strangers needs your help. Support our team to build
                  the application our community needs. Please consider
                  subscribing.
                </p>
                <Link to="/subscribe">
                  <Button size="large" type="primary">
                    Subscribe For $1/Month
                  </Button>
                </Link>
              </Space>
            </Container>
          </Container>
        )}
      </Container>
    </Page>
  );
}

export default VentsPage;
