import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsHelping } from "@fortawesome/pro-duotone-svg-icons/faHandsHelping";
import { faWalkieTalkie } from "@fortawesome/pro-duotone-svg-icons/faWalkieTalkie";

import Chat from "../../components/Chat/";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Button from "../../components/views/Button";
import Text from "../../components/views/Text";

import { isMobileOrTablet } from "../../util";

class Conversations extends Component {
  state = {
    conversations: [],
  };
  componentDidMount() {
    axios.get("/api/conversations").then((res) => {
      const { conversations } = res;
      console.log(res);
    });
  }

  componentWillUnmount() {}

  handleChange = (stateObj, callback) => {
    if (this._ismounted) this.setState(stateObj, callback);
  };

  render() {
    return (
      <Consumer>
        {(context) => (
          <Page
            className="bg-grey-2 ov-auto"
            description="Sometimes, all we need is an available ear. This is where you can anonymously talk to someone that wants to listen, or anonymously listen to someone that wants to be heard."
            keywords="vent, strangers, help"
            title="Chats"
          >
            <Container
              className={
                "column flex-fill ov-auto align-center " +
                (isMobileOrTablet() ? "" : "py32")
              }
            >
              <Link
                className="button-2 no-bold py8 px16 my16 br8"
                to="/vent-to-a-stranger"
              >
                Vent or Help a Stranger
              </Link>
            </Container>
          </Page>
        )}
      </Consumer>
    );
  }
}
Conversations.contextType = ExtraContext;

export default Conversations;
