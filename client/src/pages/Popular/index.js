import React, { Component } from "react";
import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

import LoadingHeart from "../../components/loaders/Heart";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";
import HotTags from "../../components/HotTags";
import Filters from "../../components/Filters";
import Problem from "../../components/Problem";

import { capitolizeFirstChar } from "../../util";

class PopularPage extends Component {
  render() {
    const { problems = [] } = this.context;

    return (
      <Consumer>
        {context => (
          <Page
            className="justify-center bg-grey py32"
            description="Home"
            keywords=""
            title="Home"
          >
            <Container className="container large column pa16">
              <Container className="justify-between mb16">
                <Text className="" text="Popular Problems" type="h2" />
                <Filters />
              </Container>

              {problems.length > 0 && (
                <Container className="x-fill column">
                  {context.problems &&
                    context.problems.map((problem, index) => (
                      <Problem key={index} problem={problem} />
                    ))}
                </Container>
              )}
            </Container>
            <HotTags />
          </Page>
        )}
      </Consumer>
    );
  }
}

PopularPage.contextType = ExtraContext;

export default PopularPage;
