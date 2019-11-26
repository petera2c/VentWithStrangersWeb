import React, { Component } from "react";
import { Link } from "react-router-dom";

import Page from "../../components/containers/Page";
import VWSContainer from "../../components/containers/VWSContainer";
import VWSText from "../../components/views/VWSText";

import Consumer, { ExtraContext } from "../../context";

import { capitolizeFirstChar } from "../../util";

const hotTags = [
  { name: "depression", posts: 100 },
  { name: "school", posts: 100 },
  { name: "advice", posts: 100 },
  { name: "religion", posts: 100 },
  { name: "drugs", posts: 100 },
  { name: "studies", posts: 100 },
  { name: "games", posts: 100 }
];

class HomePage extends Component {
  componentDidMount() {
    this.ismounted = true;
  }
  render() {
    let title = this.props.location.pathname;
    if (title === "/") title = "trending";

    console.log(this.context.problems);

    return (
      <Consumer>
        {context => (
          <Page
            className="justify-center bg-grey py32"
            description="Home"
            keywords=""
            title="Home"
          >
            <VWSContainer className="container-box large column">
              <VWSText
                className="mb16"
                text={`${capitolizeFirstChar(title)} Problems`}
                type="h1"
              />

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
            <VWSContainer className="column bg-white br8">
              {hotTags.map((hotTag, index) => (
                <VWSContainer key={index}>
                  <VWSText text={index} type="p" />
                  <VWSContainer className="column"></VWSContainer>
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
