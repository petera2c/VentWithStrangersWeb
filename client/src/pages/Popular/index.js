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
    const { problems } = this.context;

    return (
      <Consumer>
        {context => (
          <Page
            className="justify-center align-start bg-grey py32"
            description="Home"
            keywords=""
            title="Home"
          >
            <Container className="container large column align-center pa16 mr32">
              <Container className="x-fill justify-between mb16">
                <Text className="" text="Popular Problems" type="h4" />
                <Filters />
              </Container>

              {problems && (
                <Container className="x-fill column">
                  {context.problems &&
                    context.problems.map((problem, index) => (
                      <Problem
                        key={index}
                        problem={problem}
                        problemIndex={index}
                      />
                    ))}
                </Container>
              )}
              {!problems && <LoadingHeart />}
              {problems && problems.length === 0 && (
                <Text className="fw-400" text="No problems found." type="h4" />
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
