import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Space } from "antd";

import Container from "../../components/containers/Container";
import LoadingHeart from "../../components/views/loaders/Heart";
import MakeAd from "../../components/MakeAd";
import NewVentComponent from "../../components/NewVent";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";
import Vent from "../../components/Vent";

import { UserContext } from "../../context";

import { useIsMounted } from "../../util";
import { getMetaInformation, getVents, newVentListener } from "./util";

const cookies = new Cookies();

function VentsPage() {
  const isMounted = useIsMounted();

  const { user } = useContext(UserContext);

  const [vents, setVents] = useState([]);
  const [waitingVents, setWaitingVents] = useState([]);
  const location = useLocation();
  const { pathname, search } = location;
  const [canLoadMore, setCanLoadMore] = useState(true);

  const { metaTitle } = getMetaInformation(pathname);

  useEffect(() => {
    if (search) {
      const referral = /referral=([^&]+)/.exec(search)[1];
      if (referral) cookies.set("referral", referral);
    }

    let newVentListenerUnsubscribe;

    setWaitingVents([]);
    setVents([]);
    setCanLoadMore(true);

    getVents(isMounted, pathname, setCanLoadMore, setVents, user, null);
    newVentListenerUnsubscribe = newVentListener(
      isMounted,
      pathname,
      setWaitingVents
    );

    return () => {
      if (newVentListenerUnsubscribe) return newVentListenerUnsubscribe();
    };
  }, [isMounted, pathname, search, setCanLoadMore, user]);

  return (
    <Page className="pa16" id="scrollable-div">
      <Container className="flex-fill x-fill">
        <Container className="column flex-fill gap16">
          <NewVentComponent miniVersion />

          {(pathname === "/my-feed" || pathname === "/recent") && (
            <Container className="x-fill">
              <h1 className="primary fs-26">{metaTitle}</h1>
            </Container>
          )}
          {(pathname === "/" ||
            pathname === "/trending" ||
            pathname === "/trending/this-week" ||
            pathname === "/trending/this-month") && (
            <Container className="x-fill full-center bg-white br8 gap16 pa16">
              <Link to="/trending">
                <h2
                  className={
                    "button-3 primary fs-22 tac " +
                    (pathname === "/" || pathname === "/trending"
                      ? "active"
                      : "")
                  }
                >
                  Trending Today
                </h2>
              </Link>
              <Link to="/trending/this-week">
                <h2
                  className={
                    "button-3 primary fs-22 tac " +
                    (pathname === "/trending/this-week" ? "active" : "")
                  }
                >
                  Trending This Week
                </h2>
              </Link>
              <Link to="/trending/this-month">
                <h2
                  className={
                    "button-3 primary fs-22 tac " +
                    (pathname === "/trending/this-month" ? "active" : "")
                  }
                >
                  Trending This Month
                </h2>
              </Link>
            </Container>
          )}

          {vents && (
            <InfiniteScroll
              dataLength={vents.length}
              endMessage={
                <p className="primary tac mt16">
                  <b>Yay! You have seen it all</b>
                </p>
              }
              hasMore={canLoadMore}
              loader={
                <Container className="x-fill full-center">
                  <LoadingHeart />
                </Container>
              }
              next={() =>
                getVents(
                  isMounted,
                  pathname,
                  setCanLoadMore,
                  setVents,
                  user,
                  vents
                )
              }
              scrollableTarget="scrollable-div"
            >
              <Space className="x-fill" direction="vertical" size="large">
                {waitingVents.length > 0 && (
                  <Button
                    className="x-fill "
                    onClick={() => {
                      setVents((vents) => [...waitingVents, ...vents]);
                      setWaitingVents([]);
                    }}
                    shape="round"
                    size="large"
                  >
                    Load New Vent{waitingVents.length > 1 ? "s" : ""}
                  </Button>
                )}
                {vents &&
                  vents.map((vent, index) => {
                    return (
                      <Container className="column x-fill gap8" key={vent.id}>
                        <Vent
                          previewMode={true}
                          ventID={vent.id}
                          ventInit={vent.title ? vent : undefined}
                        />
                        {index % 3 === 0 && (
                          <MakeAd
                            banner
                            layoutKey="-em+1v+cz-83-96"
                            slot="1835301248"
                          />
                        )}
                      </Container>
                    );
                  })}
              </Space>
            </InfiniteScroll>
          )}
        </Container>

        <SubscribeColumn slot="7871419499" />
      </Container>
    </Page>
  );
}

export default VentsPage;
