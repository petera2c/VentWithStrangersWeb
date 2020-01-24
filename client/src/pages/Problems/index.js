import React, { Component } from "react";
import { withRouter } from "react-router-dom";

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

import { capitolizeFirstChar, isMobileOrTablet } from "../../util";

class Problems extends Component {
  render() {
    const { problems } = this.context;
    const { location } = this.props;
    const { pathname } = location;

    let title = capitolizeFirstChar(pathname.slice(1, pathname.length));

    if (!pathname || pathname === "/") title = "Trending";

    return (
      <Consumer>
        {context => (
          <Page
            className="bg-grey"
            description={title}
            keywords=""
            title={title}
          >
            <Container className="x-fill justify-center align-start py32">
              <Container
                className={
                  "container large column align-center " +
                  (isMobileOrTablet() ? "" : "pa16 mr32")
                }
              >
                <Container className="x-fill justify-between mb16">
                  <Text className="" text={title + " Problems"} type="h4" />
                  <Filters />
                </Container>

                {problems && (
                  <Container className="x-fill column">
                    {problems && problems.length === 0 && (
                      <Text
                        className="fw-400"
                        text="No problems found."
                        type="h4"
                      />
                    )}
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
              </Container>

              {!isMobileOrTablet() && <HotTags />}
            </Container>
          </Page>
        )}
      </Consumer>
    );
  }
}

Problems.contextType = ExtraContext;

export default withRouter(Problems);
