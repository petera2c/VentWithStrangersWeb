import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

import Consumer, { ExtraContext } from "../../context";

import Page from "../../components/containers/Page";
import VWSContainer from "../../components/containers/VWSContainer";
import VWSText from "../../components/views/VWSText";
import HotTags from "../../components/HotTags";
import Filters from "../../components/Filters";

import { getPopularProblems } from "./util";
import { capitolizeFirstChar } from "../../util";

class PopularPage extends Component {
  componentDidMount() {
    this.ismounted = true;

    const { handleChange } = this.context;

    getPopularProblems(popularProblems => {
      handleChange({ popularProblems });
    });
  }
  render() {
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
                <VWSText className="" text="Popular Problems" type="h2" />
                <Filters />
              </VWSContainer>

              <VWSContainer className="column mr32">
                {context.popularProblems &&
                  context.popularProblems.map((problem, index) => (
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
            <HotTags />
          </Page>
        )}
      </Consumer>
    );
  }
}

PopularPage.contextType = ExtraContext;

export default PopularPage;
