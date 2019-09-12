import React, { Component } from "react";
import { Link } from "react-router-dom";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIText from "../../components/views/GIText";

import Consumer, { ExtraContext } from "../../context";

class HomePage extends Component {
  render() {
    return (
      <Consumer>
        {context => (
          <Page
            className="column align-center py32"
            description="Home"
            keywords=""
            title="Home"
          >
            <GIText className="mb16" text="Recent Problems" type="h1" />
            {context.problems.map((problem, index) => (
              <Link
                className="x-50 bg-white py16 px32 br8"
                key={index}
                to={"/problems/" + problem.title}
              >
                {problem.title}
              </Link>
            ))}
          </Page>
        )}
      </Consumer>
    );
  }
}

export default HomePage;
