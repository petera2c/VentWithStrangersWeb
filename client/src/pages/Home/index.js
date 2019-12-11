import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";
import HotTags from "../../components/HotTags";

import Consumer, { ExtraContext } from "../../context";

import { capitolizeFirstChar } from "../../util";

class HomePage extends Component {
  componentDidMount() {
    this.ismounted = true;
  }
  render() {
    let title = this.props.location.pathname.substring(
      this.props.location.pathname.lastIndexOf("/") + 1
    );

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
                <Text
                  className=""
                  text={`${capitolizeFirstChar(title)} Problems`}
                  type="h1"
                />
                <Container className="full-center">
                  <Text className="mr8" text="Filters" type="h6" />
                  <FontAwesomeIcon className="mr16" icon={faChevronDown} />
                  <Text className="mr8" text={`Tags`} type="h6" />
                  <FontAwesomeIcon className="mr16" icon={faChevronDown} />
                </Container>
              </Container>

              <Container className="column mr32">
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
              </Container>
            </Container>
            <HotTags />
          </Page>
        )}
      </Consumer>
    );
  }
}

HomePage.contextType = ExtraContext;

export default HomePage;
