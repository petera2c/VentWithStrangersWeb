import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/pro-solid-svg-icons/faPen";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";
import Filters from "../../components/Filters";
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
            {false && <Filters />}
          </Container>
          {vents && (
            <Container className="x-fill column">
              {vents &&
                vents.map((vent, index) => {
                  return (
                    <Vent key={index} previewMode={true} ventID={vent.id} />
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
              <Container className="bg-red clickable x-fill column bg-white border-all2 mb16 br8">
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
            <Container className="x-fill column align-start bg-white border-all2 pa16 mb16 br8">
              <Link className="button-3 fs-18 mb16" to="/post-a-problem">
                <FontAwesomeIcon className="mr8" icon={faPen} />
                Post a Vent
              </Link>
              <Link className="button-3 fs-18" to="/conversations">
                <FontAwesomeIcon className="mr8" icon={faComments} />
                Inbox
              </Link>
            </Container>
          </Container>
        )}
      </Container>
    </Page>
  );
}

export default Vents;
