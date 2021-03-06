import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { useLocation } from "react-router-dom";
import TextArea from "react-textarea-autosize";

import firebase from "firebase/app";
import "firebase/database";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Vent from "../../components/Vent";

import Text from "../../components/views/Text";
import Button from "../../components/views/Button";

import { isMobileOrTablet } from "../../util";

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

  const regexMatch = getVentIdFromURL(pathname);
  let ventID;
  if (regexMatch) ventID = regexMatch;

  return (
    <Page
      className="justify-start align-center bg-grey-2"
      description={description}
      keywords=""
      title={title}
    >
      <Container className={isMobileOrTablet() ? "py16" : "py32"}>
        {ventID && (
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
              ventID={ventID}
            />
          </Container>
        )}
      </Container>
    </Page>
  );
}

export default VentPage;
