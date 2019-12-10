import React, { Component } from "react";
import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

import LoadingHeart from "../../components/loaders/Heart";

import Page from "../../components/containers/Page";
import VWSContainer from "../../components/containers/VWSContainer";
import VWSText from "../../components/views/VWSText";
import HotTags from "../../components/HotTags";
import Filters from "../../components/Filters";
import Problem from "../../components/Problem";

import { getTrendingProblems } from "./util";
import { capitolizeFirstChar } from "../../util";

class TrendingPage extends Component {
  componentDidMount() {
    this.ismounted = true;

    const { handleChange } = this.context;

    getTrendingProblems(trendingProblems => {
      handleChange({ trendingProblems });
    });
  }
  render() {
    const { trendingProblems = [] } = this.context;

    return (
      <Consumer>
        {context => (
          <Page
            className="justify-center align-start bg-grey py32"
            description="Home"
            keywords=""
            title="Home"
          >
            <VWSContainer className="container-box large column align-center pa16 mr32">
              <VWSContainer className="x-fill justify-between mb16">
                <VWSText className="" text="Trending Problems" type="h2" />
                <Filters />
              </VWSContainer>
              {trendingProblems.length > 0 && (
                <VWSContainer className="x-fill column">
                  {context.trendingProblems &&
                    context.trendingProblems.map((problem, index) => (
                      <Problem key={index} problem={problem} />
                    ))}
                </VWSContainer>
              )}
              {trendingProblems.length === 0 && <LoadingHeart />}
            </VWSContainer>

            <HotTags />
          </Page>
        )}
      </Consumer>
    );
  }
}

TrendingPage.contextType = ExtraContext;

export default TrendingPage;
