import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Space } from "antd";

import Container from "../../components/containers/Container";
import LoadingHeart from "../../components/loaders/Heart";
import MakeAd from "../../components/MakeAd";
import NewVentComponent from "../../components/NewVent";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";
import Vent from "../../components/Vent";

import { useIsMounted } from "../../util";
import { getMetaInformation, getVents, newVentListener } from "./util";

const cookies = new Cookies();

function VentsPage() {
  const isMounted = useIsMounted();

  const [vents, setVents] = useState([]);
  const [waitingVents, setWaitingVents] = useState([]);
  const location = useLocation();
  const { pathname, search } = location;
  const { metaDescription, metaTitle } = getMetaInformation(pathname);
  const [canLoadMore, setCanLoadMore] = useState(true);

  useEffect(() => {
    if (search) {
      const referral = /referral=([^&]+)/.exec(search)[1];
      if (referral) cookies.set("referral", referral);
    }

    let newVentListenerUnsubscribe;

    setWaitingVents([]);
    setVents([]);
    getVents(isMounted, pathname, setCanLoadMore, setVents, null);
    newVentListenerUnsubscribe = newVentListener(
      isMounted,
      pathname,
      setWaitingVents
    );

    return () => {
      if (newVentListenerUnsubscribe) return newVentListenerUnsubscribe();
    };
  }, [isMounted, pathname, search]);

  return (
    <Page
      className="pa16"
      description={metaDescription}
      id="scrollable-div"
      title={metaTitle}
    >
      <Container className="flex-fill x-fill">
        <Container className="column flex-fill gap16">
          <NewVentComponent miniVersion />
          <Container className="x-fill">
            <h1 className="primary fs-26">{metaTitle + " Vents"}</h1>
          </Container>

          {vents && (
            <InfiniteScroll
              dataLength={vents.length}
              endMessage={
                <p className="tac">
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
                getVents(isMounted, pathname, setCanLoadMore, setVents, vents)
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
                      <Space
                        className="x-fill"
                        direction="vertical"
                        size="middle"
                        key={vent.id}
                      >
                        <Vent previewMode={true} ventInit={vent} />
                        {index % 3 === 0 && (
                          <MakeAd
                            banner
                            layoutKey="-em+1v+cz-83-96"
                            slot="1835301248"
                          />
                        )}
                      </Space>
                    );
                  })}
              </Space>
            </InfiniteScroll>
          )}

          {vents && vents.length === 0 && (
            <h4 className="fw-400">No vents found.</h4>
          )}
        </Container>

        <SubscribeColumn slot="7871419499" />
      </Container>
    </Page>
  );
}

export default VentsPage;
