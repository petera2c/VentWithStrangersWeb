import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { useLocation } from "react-router-dom";
import TextArea from "react-textarea-autosize";

import firebase from "firebase/app";
import "firebase/database";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Vent from "../../components/Vent";

import LoadingHeart from "../../components/loaders/Heart";

import Text from "../../components/views/Text";
import Button from "../../components/views/Button";

import { isMobileOrTablet } from "../../util";

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
  const [vent, setVent] = useState();

  const location = useLocation();
  const { pathname } = location;

  const regexMatch = getVentIdFromURL(pathname);
  let ventID;
  if (regexMatch) ventID = regexMatch;

  const db = firebase.database();

  const postRef = db.ref("/posts/" + ventID);

  useEffect(() => {
    const listener = postRef.on("value", (snapshot) => {
      if (!snapshot) return;
      const value = snapshot.val();
      const exists = snapshot.exists();

      if (exists) setVent({ id: snapshot.key, ...value });
    });

    return () => listener();
  }, []);

  let title = "";
  let description = "";

  if (vent && vent.title) title = vent.title;
  if (vent && vent.description) description = vent.description;

  if (!vent) return <LoadingHeart />;

  return (
    <Page
      className="justify-start align-center bg-grey-2"
      description={description}
      keywords=""
      title={title}
    >
      <Container className={isMobileOrTablet() ? "py16" : "py32"}>
        {vent && (
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
              vent={vent}
            />
          </Container>
        )}
      </Container>
    </Page>
  );
}

export default VentPage;
