import React, { useState } from "react";
import moment from "moment-timezone";
import { useLocation } from "react-router-dom";
import TextArea from "react-textarea-autosize";
import AdSense from "react-adsense";

import firebase from "firebase/app";
import "firebase/database";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Vent from "../../components/Vent";

import Text from "../../components/views/Text";
import Button from "../../components/views/Button";

import { isMobileOrTablet } from "../../util";
import { getMeta } from "./util";

const getVentIdFromURL = pathname => {
  // regular expression will not work due to catastrophic backtracing
  //pathname.match(/(?<=\/problem\/\s*).*?(?=\s*\/)/gs);
  if (pathname) {
    const ventIdStart = pathname.slice(9, pathname.length);
    let ventID = "";
    for (let index in ventIdStart) {
      if (ventIdStart[index] === "/") break;
      ventID += ventIdStart[index];
    }

    return ventID;
  }
};

function VentPage() {
  const location = useLocation();
  const { pathname } = location;

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const objectFromMetaData = getMeta("vent-data");
  let ventFromMeta;
  if (objectFromMetaData && objectFromMetaData !== "vent-data-example")
    ventFromMeta = JSON.parse(objectFromMetaData);

  const [ventFound, setVentFound] = useState();

  const regexMatch = getVentIdFromURL(pathname);
  let ventID;
  if (regexMatch) ventID = regexMatch;

  return (
    <Page
      description={description}
      className="justify-start align-center bg-grey-2"
      title={title}
    >
      <Container className={isMobileOrTablet() ? "py16" : "py32"}>
        {ventFound === false && <h4>Vent Not Found</h4>}
        {process.env.NODE_ENV === "production" && !isMobileOrTablet() && (
          <Container className="container ad column align-center">
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
          </Container>
        )}
        {ventFound === undefined && ventID && (
          <Container
            className={
              "column " +
              (isMobileOrTablet()
                ? "container mobile-full px16"
                : "container large ")
            }
          >
            <Vent
              disablePostOnClick={true}
              displayCommentField
              isOnSingleVentPage={true}
              setDescription={setDescription}
              setTitle={setTitle}
              setVentFound={setVentFound}
              ventInit={{ ...ventFromMeta, id: ventID }}
            />
          </Container>
        )}
        {process.env.NODE_ENV === "production" && !isMobileOrTablet() && (
          <Container className="container ad column align-center"></Container>
        )}
      </Container>
    </Page>
  );
}

export default VentPage;
