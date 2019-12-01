import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

import VWSContainer from "../../components/containers/VWSContainer";
import VWSText from "../../components/views/VWSText";

import Consumer, { ExtraContext } from "../../context";

const hotTags = [
  { name: "depression", useCount: 100 },
  { name: "school", useCount: 100 },
  { name: "advice", useCount: 100 },
  { name: "religion", useCount: 100 },
  { name: "drugs", useCount: 100 },
  { name: "studies", useCount: 100 },
  { name: "games", useCount: 100 }
];

class HotTags extends Component {
  componentDidMount() {
    this.ismounted = true;
  }
  render() {
    return (
      <Consumer>
        {context => (
          <VWSContainer className="column bg-white pa16 br8">
            <VWSText text="Hot Tags" type="h1" />
            {hotTags.map((hotTag, index) => (
              <VWSContainer key={index}>
                <VWSText className="pa16" text={index} type="p" />
                <VWSContainer className="column pa16">
                  <VWSText text={hotTag.name} type="p" />
                  <VWSText text={hotTag.useCount} type="p" />
                </VWSContainer>
              </VWSContainer>
            ))}
          </VWSContainer>
        )}
      </Consumer>
    );
  }
}

HotTags.contextType = ExtraContext;

export default HotTags;
