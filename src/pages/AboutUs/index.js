import React from "react";
import { Link } from "react-router-dom";
import { Space } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";

import Container from "../../components/containers/Container";
import KarmaBadge from "../../components/KarmaBadge";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";

function AboutUsPage() {
  return (
    <Page
      className="pa16"
      description=""
      keywords="Learn about Vent With Strangers"
      title="Site Info"
    >
      <Container>
        <Space className="bg-white pa32 br8" direction="vertical" size="large">
          <Space direction="vertical">
            <h1 className="tac">Constructive. Feedback. Only.</h1>
            <p className="tac fw-400 mb16">
              People care and help is here. Vent and chat anonymously to be a
              part of a community committed to making the world a better place.
              This is a website for people that want to be heard and people that
              want to listen. Your mental health is our priority.
            </p>
          </Space>
          <Space direction="vertical">
            <h4>What the Heck are Karma Points?</h4>
            <p>
              Karma Points are gained when your Vent or comment gets upvoted or
              when you reach a new{" "}
              <Link className="blue" to="/rewards">
                milestone
              </Link>
              . Karma points will be lost if you are reported.
            </p>
          </Space>

          <Space direction="vertical" size="middle">
            <h6 className="mb8">With Great Power Comes Great Responsibility</h6>
            <Container className="column">
              <Space align="center">
                <KarmaBadge karma={50} />
                <p>Orange Badge @ 50 Karma Points</p>
              </Space>
              <ul>
                <li>Can create a vent once every 4 hours</li>
              </ul>
            </Container>
            <Container className="column">
              <Space align="center">
                <KarmaBadge karma={100} />
                <p>Red Badge @ 100 Karma Points</p>
              </Space>
              <ul>
                <li>Can create a vent once every 3 hours</li>
              </ul>
            </Container>
            <Container className="column">
              <Space align="center">
                <KarmaBadge karma={250} />
                <p>Green Badge @ 250 Karma Points</p>
              </Space>
              <ul>
                <li>Can create a vent once every 2 hours</li>
              </ul>
            </Container>
            <Container className="column">
              <Space align="center">
                <KarmaBadge karma={500} />
                <p>Blue Badge @ 500 Karma Points</p>
              </Space>
              <ul>
                <li>Can create a vent once every 1 hours</li>
              </ul>
            </Container>
            <Container className="column">
              <Space align="center">
                <KarmaBadge karma={2000} />
                <p>Purple Badge @ 2000 Karma Points</p>
              </Space>
              <ul>
                <li>Can create a vent once every 15 minutes</li>
              </ul>
            </Container>
            <Container className="column">
              <Space align="center">
                <KarmaBadge karma={4000} />
                <p>Fiery Rose Badge @ 4000 Karma Points</p>
              </Space>
              <ul>
                <li>Can create vents freely</li>
              </ul>
            </Container>
          </Space>

          <Space direction="vertical">
            <h4>What Can You Do on VWS?</h4>
            <ul>
              <Space direction="vertical">
                <li>Chat anonymously with strangers</li>
                <li>
                  <Link
                    className="no-bold a-tag-common-link"
                    to="/vent-to-strangers"
                  >
                    Create vents anonymously
                  </Link>
                </li>
                <li>Comment on vents anonymously</li>
                <li>
                  Tag someone in a post or comment by placing @ before their
                  username
                </li>
                <li>Earn Karma Points</li>
              </Space>
            </ul>
          </Space>

          <Space direction="vertical">
            <h4>How Do You Gain Karma Points?</h4>
            <ul>
              <Space direction="vertical">
                <li>
                  <span className="green">+4</span> For an upvote on your
                  comment
                </li>
                <li>
                  <span className="green">+2</span> For an upvote on your vent
                </li>
                <li>
                  However, the best way to earn karma is through{" "}
                  <Link className="blue" to="/rewards">
                    Rewards
                  </Link>
                </li>
                <li>
                  <span className="red">-30</span> When you get reported (for a
                  valid reason)
                </li>
              </Space>
            </ul>
          </Space>

          <Space direction="vertical">
            <h4>Where Else Can You Access VWS?</h4>
            <ul>
              <li>
                <a
                  className="underline no-bold a-tag-common-link"
                  href="https://apps.apple.com/us/app/vent-with-strangers/id1509120090"
                >
                  Apple App Store
                </a>
              </li>
              <li>
                <a
                  className="underline no-bold a-tag-common-link"
                  href="https://play.google.com/store/apps/details?id=com.commontech.ventwithstrangers&hl=en"
                >
                  Google Play Store
                </a>
              </li>
            </ul>
          </Space>
          <h6 className="bold">Follow Us on Social Media!</h6>
          <Container>
            <a
              className="mr16 "
              href="https://www.instagram.com/ventwithstrangers/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="clickable common-border white round-icon round pa8"
                icon={faInstagram}
                style={{
                  backgroundColor: "#cd486b",
                }}
              />
            </a>
            <a
              className="mr16 "
              href="https://www.facebook.com/ventwithstrangers"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="clickable common-border white round-icon round pa8"
                icon={faFacebook}
                style={{
                  backgroundColor: "#3b5998",
                }}
              />
            </a>
            <a
              className="mr16 "
              href="https://www.linkedin.com/company/vent-with-strangers/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="clickable common-border white round-icon round pa8"
                icon={faLinkedin}
                style={{
                  backgroundColor: "#0e76a8",
                }}
              />
            </a>
          </Container>
        </Space>
        <SubscribeColumn slot="1935732380" />
      </Container>
    </Page>
  );
}

export default AboutUsPage;
