import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import AdSense from "react-adsense";
import { Space } from "antd";

import { UserContext } from "../../context";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";
import UniqueShareLink from "../../components/UniqueShareLink";
import Vent from "../../components/Vent";

import { isMobileOrTablet } from "../../util";
import { getMeta } from "./util";

const getVentIdFromURL = (pathname) => {
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
  const { user, userSubscription } = useContext(UserContext);
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
    <Page className="pa16" description={description} title={title}>
      <Container>
        {ventFound === false && <h4>Vent Not Found</h4>}
        {ventFound === undefined && ventID && (
          <Space className="flex-fill" direction="vertical" size="middle">
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
        <SubscribeColumn uniqueShareLink slot="" />
      </Container>
    </Page>
  );
}

export default VentPage;
