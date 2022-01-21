import React from "react";
import loadable from "@loadable/component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/pro-regular-svg-icons/faHeart";

const Page = loadable(() => import("../../components/containers/Page"));
const Container = loadable(() =>
  import("../../components/containers/Container")
);

function FriendsPage() {
  return (
    <Page
      className="row bg-grey-2 justify-center wrap"
      description=""
      keywords="Learn about Vent With Strangers"
      title="Site Info"
    >
      <Container className="column container large bg-white pa32 ma32 br8">
        <h1 className="primary mb16">Meet our VWS Friends!</h1>
        <Container className="column ml16">
          <h6>
            <a href="https://www.instagram.com/selfcareslothss/">
              <FontAwesomeIcon icon={faHeart} /> Self-care sloth
            </a>
          </h6>
          <p className="ml16">
            A safe space on Instagram to talk about mental health
          </p>
        </Container>
      </Container>
      <Container className="align-start">
        <Container className="column container small bg-white pa32 my32 br8">
          <h2 className="" style={{ fontSize: "26px" }}>
            How to Become a Friend
          </h2>

          <p>
            We are always looking to connect with new people! Help our mission
            to eliminate mental illness. If you want to contact us, please
            message us on one of our social media channels or email us at{" "}
            <a href="mailto:ventwithstrangers@gmail.com">
              ventwithstrangers@gmail.com
            </a>
            .
          </p>
        </Container>
      </Container>
    </Page>
  );
}

export default FriendsPage;
