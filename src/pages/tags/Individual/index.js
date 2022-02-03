import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Container from "../../../components/containers/Container";
import Page from "../../../components/containers/Page";
import SubscribeColumn from "../../../components/SubscribeColumn";
import Vent from "../../../components/Vent";

import { useIsMounted, viewTag } from "../../../util";
import { getTagVents } from "./util";

function IndividualTag() {
  const { tagID } = useParams();
  const isMounted = useIsMounted();

  const [vents, setVents] = useState([]);

  useEffect(() => {
    getTagVents(isMounted, setVents, tagID, vents);
  }, []);

  return (
    <Page
      className="br-grey-2 pt32 px16 pb16"
      title={`Vents About ${viewTag(tagID)}`}
    >
      <Container>
        <Container className="column flex-fill gap16">
          <h1 className="tac">{`Trending Vents About ${viewTag(tagID)}`}</h1>
          <Link className="button-1 fs-22 tac" to="/tags">
            View All Tags
          </Link>
          <Container className="column gap8">
            {vents.map((vent, index) => (
              <Vent
                key={vent.id}
                previewMode={true}
                showVentHeader={false}
                ventID={vent.id}
                ventIndex={index}
                ventInit={{ ...vent, id: vent.id }}
                searchPreviewMode={true}
              />
            ))}
          </Container>
        </Container>
        <SubscribeColumn slot="3444073995" />
      </Container>
    </Page>
  );
}

export default IndividualTag;
