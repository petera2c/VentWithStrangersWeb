import React, { Component } from "react";
import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons/faFire";

import LoadingHeart from "../../components/loaders/Heart";

import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import { capitolizeFirstChar } from "../../util";

import { getTrendingTags } from "./util";

class HotTags extends Component {
  componentDidMount() {
    this.ismounted = true;
    const { handleChange } = this.context;

    getTrendingTags(tags => handleChange({ hotTags: tags }));
  }
  render() {
    const { hotTags = [] } = this.context;

    return (
      <Consumer>
        {context => (
          <Container className="x-25 column align-center bg-white br8">
            <Container className="x-fill border-bottom py16">
              <Container className="align-center border-left active large px16">
                <FontAwesomeIcon className="blue mr8" icon={faFire} />
                <Text className="blue fw-300" text="Hot Tags" type="h4" />
              </Container>
            </Container>
            {hotTags.map((hotTag, index) => (
              <Container
                className={`x-fill align-center ${
                  index !== hotTags.length - 1 ? "border-bottom" : ""
                } px16`}
                key={index}
              >
                <Text
                  className="round-icon bg-light-blue blue fs-12"
                  text={index}
                  type="p"
                />
                <Container className="column pa16">
                  <Text text={capitolizeFirstChar(hotTag.name)} type="p" />
                  <Text className="grey-5" text={hotTag.uses} type="p" />
                </Container>
              </Container>
            ))}
            {hotTags.length === 0 && <LoadingHeart />}
          </Container>
        )}
      </Consumer>
    );
  }
}

HotTags.contextType = ExtraContext;

export default HotTags;
