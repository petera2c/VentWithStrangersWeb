import React, { Component } from "react";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import { isMobileOrTablet } from "../../util";

class AboutUsPage extends Component {
  render() {
    return (
      <Page
        className="bg-grey-2 full-center"
        description=""
        keywords="Learn about Vent With Strangers"
        title="About Us"
      >
        <Container className="column container large bg-white pa32 ma32 br8">
          <h1 className="primary mb16">Why Does Vent With Strangers Exist?</h1>
          <p className="mb8">
            We know how it feels to believe that no one is listening. We know
            what it’s like to need to share and not have anyone to talk with.
            And we know what a difference it makes to realize that someone is
            listening and that open hearts and minds are willing to hear our
            stories.
          </p>
          <p className="mb8">
            Vent With Strangers exists for any person of any age to share their
            fears, feelings, and secrets anonymously with other humans - who
            will show up for you, no matter what.
          </p>
          <p className="mb8">
            Mental health is a crucially important - and often overlooked - part
            of human existence, and we felt like other platforms designed to let
            you vent lacked one necessary element: your privacy. We have
            designed VWS to be completely anonymous, so your identity is
            protected. We’ve also noticed that online bullying is an issue
            plaguing many who go onto the Internet to seek advice, so we have
            specifically designed VWS to be a platform that champions all people
            and all problems, with a strict anti-hate policy. Our moderators
            comb through conversations as they happen and immediately block any
            negative sentiment or hatred. Your safety and comfort are essential
            aspects of Vent With Strangers.
          </p>
          <p className="mb16">
            We believe that health begins in the mind and that encouraging
            companionship, helpful advice, unconditional support, and positive
            affirmation from others who’ve been through it can do magic for the
            soul. By anonymously connecting the many people in crisis with the
            many who want to help, no matter where they may be in the world or
            their lives, we strive for a better, healthier collective future
            that focuses on connection, vulnerability, and courage.
          </p>
          <h4 className="mb16">What Can You Do on VWS?</h4>
          <p className="mb8">
            - Sign up entirely anonymously or use the website without signing up
          </p>
          <p className="mb8">
            -{" "}
            <a
              className="no-bold a-tag-common-link"
              href="https://www.ventwithstrangers.com/vent-to-strangers"
            >
              Post on our board anonymously
            </a>
          </p>
          <p className="mb8">- Comment on our board anonymously</p>

          <p className="mb16">
            - Tag someone in a post or comment by placing @ before their
            username
          </p>
          <h4 className="mb16">Where Can you Access VWS?</h4>
          <p className="mb8">
            -{" "}
            <a
              className="no-bold a-tag-common-link"
              href="https://www.ventwithstrangers.com"
            >
              On our website
            </a>
          </p>
          <p className="mb8">
            {" "}
            -{" "}
            <a
              className="no-bold a-tag-common-link"
              href="https://apps.apple.com/us/app/vent-with-strangers/id1509120090"
            >
              Apple Store
            </a>
          </p>
          <p className="mb8">
            {" "}
            -{" "}
            <a
              className="no-bold a-tag-common-link"
              href="https://play.google.com/store/apps/details?id=com.commontech.ventwithstrangers&hl=en"
            >
              Google Store
            </a>
          </p>
        </Container>
      </Page>
    );
  }
}

export default AboutUsPage;
