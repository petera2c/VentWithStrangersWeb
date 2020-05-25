import React, { Component } from "react";
import axios from "axios";

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
            title="Vent With Strangers app downloads."
          >
            <Container
              className={
                "column flex-fill ov-auto full-center " +
                (isMobileOrTablet() ? "" : "py32")
              }
            >
              <Container className="column full-center">
                <Text
                  className={
                    "primary fs-30 " +
                    (isMobileOrTablet() ? "px32 pt32" : "pb32")
                  }
                  text="Download Mobile App Now!"
                  type="h1"
                />
                <Container className="wrap full-center mt16">
                  <img
                    alt=""
                    className={
                      "clickable column container small mb16 br8 " +
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
                      "clickable column container small mb16 br8 " +
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
