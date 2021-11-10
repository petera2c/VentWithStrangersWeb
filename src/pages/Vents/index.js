import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/pro-duotone-svg-icons/faPen";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons/faUsers";
import { faInfo } from "@fortawesome/pro-duotone-svg-icons/faInfo";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";
import Vent from "../../components/Vent";
import LoadMore from "../../components/LoadMore";

import { capitolizeFirstChar, isMobileOrTablet } from "../../util";
import { getMetaInformation, getVents } from "./util";

function Vents() {
  const [vents, setVents] = useState(null);
  const location = useLocation();
  const { pathname, search } = location;
  const { metaDescription, metaTitle } = getMetaInformation(pathname);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [pathname2, setPathname2] = useState(pathname);

  if (pathname !== pathname2) {
    setVents(null);
    getVents(pathname, setCanLoadMore, setVents, null);
    setPathname2(pathname);
  }

  useEffect(() => {
    getVents(pathname, setCanLoadMore, setVents, null);

    const script = document.createElement("script");
    script.text = `amzn_assoc_placement = "adunit0";
    amzn_assoc_search_bar = "true";
    amzn_assoc_tracking_id = "ventwithstran-20";
    amzn_assoc_ad_mode = "manual";
    amzn_assoc_ad_type = "smart";
    amzn_assoc_marketplace = "amazon";
    amzn_assoc_region = "US";
    amzn_assoc_title = "My Amazon Picks";
    amzn_assoc_linkid = "58c4e58d58f0ea8e3404ffb6c831d47f";
    amzn_assoc_asins = "B08YDSSD7P,B00CWXPEPE,B01MQJO2CT,B099VMT8VZ";`;

    const script2 = document.createElement("script");
    script2.src = "//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US";
    script2.async = false;

    const amazonAdd = document.querySelector(
      "#amzn_assoc_ad_div_assoc_banner_placement_default_0"
    );
    if (amazonAdd) {
      amazonAdd.appendChild(script);
      amazonAdd.appendChild(script2);
    }
  }, [location]);

  return (
    <Page
      className="column bg-grey-2"
      description={metaDescription}
      keywords=""
      title={metaTitle}
    >
      <Container className="x-fill justify-center align-start">
        <Text
          className={
            "fw-400 fs-20 " +
            (isMobileOrTablet()
              ? "container mobile-full pa16"
              : "container extra-large pr32 pt32")
          }
          text="People care and help is here. Vent and chat anonymously to be a part of a community committed to making the world a better place. This is a website for people that want to be heard and people that want to listen. Your emotional health is our priority."
          type="h2"
        />
      </Container>
      <Container
        className={
          "x-fill justify-center align-start " +
          (isMobileOrTablet() ? "py16" : "py32")
        }
      >
        <Container
          className={
            "column align-center " +
            (isMobileOrTablet()
              ? "container mobile-full pa16"
              : "container large mr32")
          }
        >
          <Container className="x-fill justify-between mb16">
            <Text
              className="primary fs-20"
              text={metaTitle + " Vents"}
              type="h1"
            />
          </Container>
          <div id="amzn_assoc_ad_div_assoc_banner_placement_default_0" />

          {vents && (
            <Container className="x-fill column">
              {vents &&
                vents.map((vent, index) => {
                  return (
                    <Vent key={index} previewMode={true} ventInit={vent} />
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
          <Container className="container small column">
            <Container className="x-fill column align-start bg-white pa16 mb16 br8">
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
                <FontAwesomeIcon className="mr8" icon={faInfo} />
                Site Info
              </Link>
            </Container>
          </Container>
        )}
      </Container>
    </Page>
  );
}

export default Vents;
