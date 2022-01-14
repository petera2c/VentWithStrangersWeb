import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import { Space } from "antd";

import Container from "../../components/containers/Container";
import LoadMore from "../../components/LoadMore";
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
    <Page className="pa16" description={metaDescription} title={metaTitle}>
      <Container className="flex-fill x-fill">
        <Space className="flex-fill" direction="vertical" size="large">
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

        <SubscribeColumn slot="3226323822" />
      </Container>
    </Page>
  );
}

export default VentsPage;
