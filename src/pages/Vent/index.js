import React, { useContext, useState } from "react";
import moment from "moment-timezone";
import { useLocation } from "react-router-dom";
import TextArea from "react-textarea-autosize";
import AdSense from "react-adsense";
import { Space } from "antd";

import firebase from "firebase/app";
import "firebase/database";

import { UserContext } from "../../context";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import UniqueShareLink from "../../components/UniqueShareLink";
import Vent from "../../components/Vent";

import Text from "../../components/views/Text";

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
  const { user } = useContext(UserContext);
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
      <Container
        className={isMobileOrTablet() ? "column align-center py16" : "py32"}
      >
        {ventFound === false && <h4>Vent Not Found</h4>}
        {!isMobileOrTablet() && (
          <Container className="container ad column align-center">
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
                    slot="3872937497"
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
        {ventFound === undefined && ventID && (
          <Space
            className={
              "px16 " +
              (isMobileOrTablet() ? "container mobile-full" : "container large")
            }
            direction="vertical"
            size="middle"
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
          </Space>
        )}
        <Container className="container ad column align-center">
          {user && <UniqueShareLink user={user} />}
        </Container>
      </Container>
    </Page>
  );
}

export default VentPage;
