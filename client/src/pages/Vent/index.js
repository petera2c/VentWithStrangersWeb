import React, { Component } from "react";
import moment from "moment-timezone";
import TextArea from "react-textarea-autosize";
import Consumer, { ExtraContext } from "../../context";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Vent from "../../components/Vent";

import LoadingHeart from "../../components/loaders/Heart";

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

class VentPage extends Component {
  componentDidMount() {
    this._ismounted = true;

    const { location } = this.props;
    const { handleChange, notify, socket } = this.context;
    const { pathname } = location;

    const regexMatch = getVentIdFromURL(pathname);
    let ventID;
    if (regexMatch) ventID = regexMatch;

    if (ventID)
      socket.emit("get_problem", ventID, result => {
        const { message, problems, success } = result;

        if (success)
          handleChange({
            vents: problems
          });
        else if (message) notify({ message, type: "danger" });
        else
          notify({
            message:
              "Something unexpected has happened, please refresh the page and try again.",
            type: "danger"
          });
      });
    else
      notify({
        message: "No post ID.",
        type: "danger"
      });
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  render() {
    const { vents } = this.context;
    let title = "";
    let description = "";

    if (vents && vents[0] && vents[0].title) title = vents[0].title;
    if (vents && vents[0] && vents[0].description)
      description = vents[0].description;

    return (
      <Page
        className="justify-start align-center bg-grey-2"
        description={description}
        keywords=""
        title={title}
      >
        <Container className={isMobileOrTablet() ? "py16" : "py32"}>
          {vents && (
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
                vent={vents[0]}
                ventIndex={0}
              />
            </Container>
          )}
          {!vents && <LoadingHeart />}
        </Container>
      </Page>
    );
  }
}
VentPage.contextType = ExtraContext;

export default VentPage;
