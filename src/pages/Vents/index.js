import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import { Space } from "antd";

import Container from "../../components/containers/Container";
import LoadingHeart from "../../components/loaders/Heart";
import MakeAd from "../../components/MakeAd";
import NewVentComponent from "../../components/NewVent";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";
import Vent from "../../components/Vent";

import { useIsMounted } from "../../util";
import { getMetaInformation, getVents } from "./util";

const cookies = new Cookies();

function VentsPage() {
  const isMounted = useIsMounted();

  const [vents, setVents] = useState(null);
  const location = useLocation();
  const { pathname, search } = location;
  const { metaDescription, metaTitle } = getMetaInformation(pathname);
  const [canLoadMore, setCanLoadMore] = useState(true);

  useEffect(() => {
    setVents(null);

    getVents(isMounted, pathname, setCanLoadMore, setVents, null);

    if (search) {
      const referral = /referral=([^&]+)/.exec(search)[1];
      if (referral) cookies.set("referral", referral);
    }
  }, [isMounted, pathname, search]);

  return (
    <Page
      className="pa16"
      description={metaDescription}
      id="scrollable-div"
      title={metaTitle}
    >
      <Container className="flex-fill x-fill">
        <Space className="flex-fill" direction="vertical" size="large">
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
        </Space>

        <SubscribeColumn slot="7871419499" />
      </Container>
    </Page>
  );
}

export default VentsPage;
