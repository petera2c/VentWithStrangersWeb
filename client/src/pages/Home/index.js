import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

import Page from "../../components/containers/Page";
import VWSContainer from "../../components/containers/VWSContainer";
import VWSText from "../../components/views/VWSText";

import Consumer, { ExtraContext } from "../../context";

import { capitolizeFirstChar } from "../../util";

const hotTags = [
  { name: "depression", useCount: 100 },
  { name: "school", useCount: 100 },
  { name: "advice", useCount: 100 },
  { name: "religion", useCount: 100 },
  { name: "drugs", useCount: 100 },
  { name: "studies", useCount: 100 },
  { name: "games", useCount: 100 }
];

class HomePage extends Component {
  componentDidMount() {
    this.ismounted = true;
  }
  render() {
    let title = this.props.location.pathname.substring(
      this.props.location.pathname.lastIndexOf("/") + 1
    );

    return (
      <Consumer>
        {context => (
          <Page
            className="justify-center bg-grey py32"
            description="Home"
            keywords=""
            title="Home"
          >
            <VWSContainer className="container-box large column pa16">
              <VWSContainer className="justify-between mb16">
                <VWSText
                  className=""
                  text={`${capitolizeFirstChar(title)} Problems`}
                  type="h1"
                />
                <VWSContainer className="full-center">
                  <VWSText className="mr8" text={`Filters`} type="h6" />
                  <FontAwesomeIcon className="mr16" icon={faChevronDown} />
                  <VWSText className="mr8" text={`Tags`} type="h6" />
                  <FontAwesomeIcon className="mr16" icon={faChevronDown} />
                </VWSContainer>
              </VWSContainer>

              <VWSContainer className="column mr32">
                {context.problems &&
                  context.problems.map((problem, index) => (
                    <Link
                      className="x-50 bg-white py16 px32 br8"
                      key={index}
                      to={"/problems/" + problem.title}
                    >
                      {problem.title}
                    </Link>
                  ))}
              </VWSContainer>
            </VWSContainer>
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
          </Page>
        )}
      </Consumer>
    );
  }
}

HomePage.contextType = ExtraContext;

export default HomePage;
