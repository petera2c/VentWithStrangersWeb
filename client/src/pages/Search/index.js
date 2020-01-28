import React, { Component } from "react";
import Consumer, { ExtraContext } from "../../context";
import { withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

import LoadingHeart from "../../components/loaders/Heart";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";
import HotTags from "../../components/HotTags";
import Filters from "../../components/Filters";
import Problem from "../../components/Problem";
import LoadMoreProblems from "../../components/LoadMoreProblems";

import { searchProblems } from "./util";
import { isMobileOrTablet } from "../../util";

class SearchPage extends Component {
  render() {
    const { location } = this.props;
    let { search = "" } = location;
    search = search.slice(1, search.length);

    return (
      <Consumer>
        {context => (
          <Page
            className="align-center bg-grey-2"
            description="Home"
            keywords=""
            title="Home"
          >
            <Container
              className={
                "container large column align-center py32 " +
                (isMobileOrTablet() ? "" : "px16 mr32")
              }
            >
              <Container className="x-fill justify-end mb16">
                <Filters />
              </Container>

              {context.problems && (
                <Container className="x-fill column">
                  {context.problems &&
                    context.problems.map((problem, index) => (
                      <Problem
                        key={index}
                        previewMode={true}
                        problem={problem}
                        problemIndex={index}
                        searchPreviewMode={true}
                      />
                    ))}
                  {context.canLoadMorePosts && (
                    <LoadMoreProblems
                      loadMore={() => {
                        context.handleChange({ skip: context.skip + 10 }, () =>
                          searchProblems(
                            context.handleChange,
                            context.problems,
                            search,
                            context.skip + 10,
                            context.socket
                          )
                        );
                      }}
                    />
                  )}
                </Container>
              )}
              {!context.problems && <LoadingHeart />}
              {context.problems && context.problems.length === 0 && (
                <Text className="fw-400" text="No problems found." type="h4" />
              )}
            </Container>
          </Page>
        )}
      </Consumer>
    );
  }
}

SearchPage.contextType = ExtraContext;

export default withRouter(SearchPage);
