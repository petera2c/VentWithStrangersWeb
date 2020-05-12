import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faPen } from "@fortawesome/pro-solid-svg-icons/faPen";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";

import LoadingHeart from "../../components/loaders/Heart";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";
import HotTags from "../../components/HotTags";
import Filters from "../../components/Filters";
import Vent from "../../components/Vent";
import LoadMoreVents from "../../components/LoadMoreVents";

import { capitolizeFirstChar, isMobileOrTablet } from "../../util";

//People care and help is here. Vent in our anonymous forum or chat anonymously to be apart of a community committed to making the world a better place.
class Vents extends Component {
  render() {
    const { vents } = this.context;
    const { location } = this.props;
    const { pathname, search } = location;

    let title = "";
    if (pathname === "/recent") title = "Recent";
    else if (pathname === "/popular") title = "Popular";
    else title = "Trending";

    let metaDescription =
      "People care. Vent and chat anonymously to be apart of a community committed to making the world a better place.";

    if (pathname === "/popular")
      metaDescription =
        "Vents and issues that have the most upvotes and comments of all time. Post, comment, and/or like anonymously.";
    else if (pathname === "/recent")
      metaDescription =
        "The latest vents and issues people have posted. Post, comment, and/or like anonymously.";
    else if (pathname === "/trending")
      metaDescription =
        "People’s vents and issues with the most upvotes in the past 24 hours. Post, comment, and/or like anonymously.";

    return (
      <Consumer>
        {context => (
          <Page
            className="column bg-grey-2"
            description={metaDescription}
            keywords=""
            title={title}
          >
            <Container className="x-fill justify-center align-start">
              <Text
                className={
                  "fw-400 fs-20 " +
                  (isMobileOrTablet()
                    ? "container mobile-full pa16"
                    : "container extra-large pr32 pt32")
                }
                text="This is a website for people that want to be heard and people that want to listen. Your emotional health is our priority."
                type="h2"
              />
            </Container>
            <Container
              className={
                "x-fill justify-center align-start " +
                (isMobileOrTablet() ? "py16" : "py32")
              }
            >
              <Container
                className={
                  "column align-center " +
                  (isMobileOrTablet()
                    ? "container mobile-full pa16"
                    : "container large mr32")
                }
              >
                <Container className="x-fill justify-between mb16">
                  <Text
                    className="primary fs-20"
                    text={title + " Vents"}
                    type="h1"
                  />
                  <Filters />
                </Container>

                {vents && (
                  <Container className="x-fill column">
                    {vents && vents.length === 0 && (
                      <Text
                        className="fw-400"
                        text="No vents found."
                        type="h4"
                      />
                    )}
                    {context.vents &&
                      context.vents.map((vent, index) => (
                        <Vent
                          key={index}
                          previewMode={true}
                          vent={vent}
                          ventIndex={index}
                        />
                      ))}
                    {context.canLoadMorePosts && (
                      <LoadMoreVents
                        canLoadMorePosts={context.canLoadMorePosts}
                        loadMore={() => {
                          context.handleChange(
                            { skip: context.skip + 10 },
                            () => context.getVents(pathname, search)
                          );
                        }}
                      />
                    )}
                  </Container>
                )}
                {!vents && <LoadingHeart />}
              </Container>

              {!isMobileOrTablet() && (
                <Container className="container small column">
                  <Container className="x-fill column align-start bg-white border-all2 pa16 mb16 br8">
                    <Link className="button-3 fs-18 mb16" to="/post-a-problem">
                      <FontAwesomeIcon className="mr8" icon={faPen} />
                      Post a Vent
                    </Link>
                    <Link className="button-3 fs-18" to="/vent-to-a-stranger">
                      <FontAwesomeIcon className="mr8" icon={faComments} />
                      Chat with a Stranger
                    </Link>
                  </Container>
                  <HotTags />
                </Container>
              )}
            </Container>
          </Page>
        )}
      </Consumer>
    );
  }
}

Vents.contextType = ExtraContext;

export default withRouter(Vents);
