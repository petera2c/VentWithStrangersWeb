import React, { Component } from "react";
import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons/faFire";

import LoadingHeart from "../../components/loaders/Heart";

import VWSContainer from "../../components/containers/VWSContainer";
import VWSText from "../../components/views/VWSText";

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
          <VWSContainer className="x-25 column align-center bg-white br8">
            <VWSContainer className="x-fill border-bottom py16">
              <VWSContainer className="align-center border-left active large px16">
                <FontAwesomeIcon className="blue mr8" icon={faFire} />
                <VWSText className="blue fw-300" text="Hot Tags" type="h4" />
              </VWSContainer>
            </VWSContainer>
            {hotTags.map((hotTag, index) => (
              <VWSContainer
                className={`x-fill align-center ${
                  index !== hotTags.length - 1 ? "border-bottom" : ""
                } px16`}
                key={index}
              >
                <VWSText
                  className="round-icon bg-light-blue blue fs-12"
                  text={index}
                  type="p"
                />
                <VWSContainer className="column pa16">
                  <VWSText text={capitolizeFirstChar(hotTag.name)} type="p" />
                  <VWSText className="grey-5" text={hotTag.uses} type="p" />
                </VWSContainer>
              </VWSContainer>
            ))}
            {hotTags.length === 0 && <LoadingHeart />}
          </VWSContainer>
        )}
      </Consumer>
    );
  }
}

HotTags.contextType = ExtraContext;

export default HotTags;
