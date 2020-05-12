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
import Vent from "../../components/Vent";
import LoadMoreVents from "../../components/LoadMoreVents";

import { searchVents } from "./util";
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
            description="Search"
            keywords=""
            title={search ? search : "Search"}
          >
            <Container
              className={
                "column align-center py32 " +
                (isMobileOrTablet()
                  ? "container mobile-full px16"
                  : "container large px16 mr32")
              }
            >
              <Container className="x-fill justify-end mb16">
                <Filters />
              </Container>

              {context.vents && (
                <Container className="x-fill column">
                  {context.vents &&
                    context.vents.map((Vent, index) => (
                      <Vent
                        key={index}
                        previewMode={true}
                        Vent={Vent}
                        ventIndex={index}
                        searchPreviewMode={true}
                      />
                    ))}
                  {context.canLoadMorePosts && (
                    <LoadMoreVents
                      canLoadMorePosts={context.canLoadMorePosts}
                      loadMore={() => {
                        context.handleChange({ skip: context.skip + 10 }, () =>
                          searchVents(
                            context.handleChange,
                            context.vents,
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
              {!context.vents && <LoadingHeart />}
              {context.vents && context.vents.length === 0 && (
                <Text className="fw-400" text="No vents found." type="h4" />
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
