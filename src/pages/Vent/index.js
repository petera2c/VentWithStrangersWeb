import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Space } from "antd";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";
import Vent from "../../components/Vent";

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
          <Container className="column flex-fill gap12">
            <Vent
              disablePostOnClick={true}
              displayCommentField
              isOnSingleVentPage={true}
              setDescription={setDescription}
              setTitle={setTitle}
              setVentFound={setVentFound}
              ventID={ventID}
              ventInit={{ ...ventFromMeta, id: ventID }}
            />
          </Container>
        )}
        <SubscribeColumn uniqueShareLink slot="3336443960" />
      </Container>
    </Page>
  );
}

export default VentPage;
