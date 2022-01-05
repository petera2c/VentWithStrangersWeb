import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import AdSense from "react-adsense";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/pro-duotone-svg-icons/faPen";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons/faUsers";
import { faInfo } from "@fortawesome/pro-duotone-svg-icons/faInfo";
import { faUserFriends } from "@fortawesome/pro-duotone-svg-icons/faUserFriends";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";
import Vent from "../../components/Vent";
import LoadMore from "../../components/LoadMore";

import {
  capitolizeFirstChar,
  getTotalOnlineUsers,
  isMobileOrTablet
} from "../../util";
import { getMetaInformation, getVents } from "./util";
import { UserContext } from "../../context";

function VentsPage() {
  const componentIsMounted = useRef(true);
  const user = useContext(UserContext);

  const [vents, setVents] = useState(null);
  const location = useLocation();
  const { pathname, search } = location;
  const { metaDescription, metaTitle } = getMetaInformation(pathname);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [pathname2, setPathname2] = useState(pathname);
  const [totalOnlineUsers, setTotalOnlineUsers] = useState(0);

  if (pathname !== pathname2) {
    setVents(null);
    getVents(pathname, setCanLoadMore, setVents, null);
    setPathname2(pathname);
  }

  let onlineUsersUnsubscribe;

  useEffect(() => {
    onlineUsersUnsubscribe = getTotalOnlineUsers(totalOnlineUsers => {
      if (componentIsMounted.current) setTotalOnlineUsers(totalOnlineUsers);
    });
    getVents(pathname, setCanLoadMore, setVents, null);

    return () => {
      componentIsMounted.current = false;
      if (onlineUsersUnsubscribe) onlineUsersUnsubscribe.off("value");
    };
  }, [location]);

  return (
    <Page
      className="column bg-grey-2"
      description={metaDescription}
      keywords=""
      title={metaTitle}
    >
      <Container
        className={
          "x-fill justify-center " + (isMobileOrTablet() ? "py16" : "py32")
        }
      >
        <Container
          className={
            "column align-center pa16 " +
            (isMobileOrTablet() ? "container mobile-full" : "container large")
          }
        >
          <Container className="x-fill justify-between mb16">
            <h1 className="primary fs-26">{metaTitle + " Vents"}</h1>
          </Container>

          {vents && (
            <Container className="x-fill column">
              {vents &&
                vents.map((vent, index) => {
                  return (
                    <Container className="x-fill column" key={index}>
                      <Vent previewMode={true} ventInit={vent} />
                      {process.env.NODE_ENV === "production" &&
                        index % 3 === 0 && (
                          <Container className="x-fill column mb16">
                            <AdSense.Google
                              className="adsbygoogle"
                              client="ca-pub-5185907024931065"
                              format="fluid"
                              layoutKey="-em+1v+cz-83-96"
                              responsive="true"
                              slot="1835301248"
                              style={{
                                display: "block"
                              }}
                            />
                          </Container>
                        )}
                    </Container>
                  );
                })}
            </Container>
          )}
          {canLoadMore && (
            <LoadMore
              canLoadMore={canLoadMore}
              loadMore={() =>
                getVents(pathname, setCanLoadMore, setVents, vents)
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
            <Text className="fw-400" text="No vents found." type="h4" />
          )}
        </Container>

        {!isMobileOrTablet() && (
          <Container className="container ad column pt16">
            <Container className="x-fill justify-between mb16">
              <h1 className="primary fs-20" style={{ minHeight: "35px" }}></h1>
            </Container>
            <Container className="x-fill column align-start bg-white pa16 mb16 br8">
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
              <Link className="button-3 fs-18 mb16" to="/conversations">
                <FontAwesomeIcon className="mr8" icon={faUsers} />
                Make Friends
              </Link>
              <Link className="button-3 fs-18" to="/site-info">
                <FontAwesomeIcon className="ml8 mr16" icon={faInfo} />
                Site Info
              </Link>
            </Container>

            {process.env.NODE_ENV === "production" && (
              <Container
                className="sticky top-0 column x-fill"
                style={{ top: "120px" }}
              >
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
                      maxHeight: "800px"
                    }}
                  />
                </Container>
              </Container>
            )}
          </Container>
        )}
      </Container>
    </Page>
  );
}

export default VentsPage;
