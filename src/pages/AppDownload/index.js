import React, { Component } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";

import Consumer, { ExtraContext } from "../../context";

import Chat from "../../components/Chat/";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import { isMobileOrTablet } from "../../util";

class AppDownloadPage extends Component {
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };

  render() {
    return (
      <Consumer>
        {context => (
          <Page
            className="bg-grey-2 ov-auto"
            description="Vent With Strangers app downloads."
            keywords=""
            title="App Downloads"
          >
            <Container
              className={
                "column flex-fill ov-auto full-center py16 " +
                (isMobileOrTablet() ? "" : "")
              }
            >
              <Container className="column full-center">
                <Container className="column full-center mb16">
                  <img
                    alt=""
                    className={
                      "column container extra-small br8 " +
                      (isMobileOrTablet() ? "px16" : "")
                    }
                    src={require("../../svgs/icon.svg")}
                    title="Vent With Strangers"
                  />
                  <Text
                    className="fw-400 fs-40 primary tac"
                    type="h1"
                    style={{ fontSize: "40px", lineHeight: "30px" }}
                  >
                    <Text className="bold" type="span">
                      Vent&nbsp;
                    </Text>
                    With
                  </Text>
                  <Text
                    className="primary fw-400"
                    type="h1"
                    style={{ fontSize: "30px" }}
                  >
                    Strangers
                  </Text>
                </Container>
                <Text
                  className={
                    "primary " + (isMobileOrTablet() ? "px32 pt32" : "")
                  }
                  text="Download Mobile App Now!"
                  type="h3"
                />
                <Container className="wrap full-center mt16">
                  <img
                    alt=""
                    className={
                      "clickable column mb16 br8 " +
                      (isMobileOrTablet() ? "px16" : "mr16")
                    }
                    onClick={() =>
                      window.open(
                        "https://play.google.com/store/apps/details?id=com.commontech.ventwithstrangers&hl=en"
                      )
                    }
                    src={require("../../../static/googleplay.png")}
                    style={{ width: "200px" }}
                    title="Download on Google Play!"
                  />
                  <img
                    alt=""
                    className={
                      "clickable column mb16 br8 " +
                      (isMobileOrTablet() ? "px16" : "")
                    }
                    onClick={() =>
                      window.open(
                        "https://apps.apple.com/us/app/vent-with-strangers/id1509120090"
                      )
                    }
                    src={require("../../../static/appstore.png")}
                    style={{ width: "200px" }}
                    title="Download on iPhone"
                  />
                </Container>
                <Container className="full-center column bg-white pa16 br8">
                  <Container className="mb16">
                    <FontAwesomeIcon
                      className="clickable pr8"
                      color="#3b5998"
                      icon={faFacebook}
                      onClick={() =>
                        window.open(
                          "https://www.facebook.com/Vent-With-Strangers-107974334114699/"
                        )
                      }
                      size="4x"
                    />
                    <FontAwesomeIcon
                      className="clickable pl8"
                      color="#E1306C"
                      icon={faInstagram}
                      onClick={() =>
                        window.open(
                          "https://www.instagram.com/ventwithstrangers/"
                        )
                      }
                      size="4x"
                    />
                  </Container>
                  <Text className="primary" text="Follow us!" type="h3" />
                </Container>
              </Container>
            </Container>
          </Page>
        )}
      </Consumer>
    );
  }
}
AppDownloadPage.contextType = ExtraContext;

export default AppDownloadPage;
