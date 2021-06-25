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
        title="Site Info"
      >
        <Container className="column container large bg-white pa32 ma32 br8">
          <h4 className="mb16">What Can You Do on VWS?</h4>
          <p className="mb8">· Chat anonymously with strangers</p>
          <p className="mb8">
            · Sign up entirely anonymously or use the website without signing up
          </p>
          <p className="mb8">
            ·{" "}
            <a
              className="no-bold a-tag-common-link"
              href="https://www.ventwithstrangers.com/vent-to-strangers"
            >
              Post on our board anonymously
            </a>
          </p>
          <p className="mb8">· Comment on our board anonymously</p>
          <p className="mb8">
            · Tag someone in a post or comment by placing @ before their
            username
          </p>
          <p className="mb16">· Earn Karma Points</p>

          <h4 className="mb16">What the Heck are Karma Points?</h4>
          <p className="mb16">
            Karma Points are awarded to you when your Vent or comment gets
            upvoted or when you upvote a Vent or comment. Karma Points are taken
            away when you get reported for a valid reason. Be nice and don’t get
            reported!
          </p>
          <h6 className="bold mb16">Karma Points are Awarded as Follows</h6>
          <p className="pl8 mb8">· +10 for an upvote on your comment</p>
          <p className="pl8 mb8">· +10 for an upvote on your vent</p>
          <p className="pl8 mb8">· +1 when you upvote someone else’s comment</p>
          <p className="pl8 mb8">· +1 when you upvote someone else’s vent</p>
          <p className="pl8 mb16">
            · -10 when you get reported for a valid reason
          </p>
          <h6 className="bold mb16">Karma Badges</h6>
          <p className="mb8">· Bronze Badge @ 50 Karma Points</p>
          <p className="mb8">· Silver Badge @ 100 Karma Points</p>
          <p className="mb8">· Gold Badge @ 250 Karma Points</p>
          <p className="mb8">· Elite Red Badge @ 500 Karma Points</p>
          <p className="mb16">· Site Moderator Title @ 5000 Karma Points</p>
          <h6 className="bold mb16">
            With Great Power Comes Great Responsibility
          </h6>
          <p className="mb16">
            Gold, Silver, Bronze, and Elite Red badges are milestones while you
            work your way to the Site Moderator Title. As a Site Moderator, you
            will be able to edit/delete up to 3 vents and comments a day and
            also ban 2 users per day.
          </p>

          <h4 className="mb16">Where Else Can You Access VWS?</h4>
          <p className="mb8">
            {" "}
            ·{" "}
            <a
              className="underline no-bold a-tag-common-link"
              href="https://apps.apple.com/us/app/vent-with-strangers/id1509120090"
            >
              Apple App Store
            </a>
          </p>
          <p className="mb16">
            {" "}
            ·{" "}
            <a
              className="underline no-bold a-tag-common-link"
              href="https://play.google.com/store/apps/details?id=com.commontech.ventwithstrangers&hl=en"
            >
              Google Play Store
            </a>
          </p>
        </Container>
      </Page>
    );
  }
}

export default AboutUsPage;
