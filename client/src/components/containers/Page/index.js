import React, { Component } from "react";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga";
import { withRouter } from "react-router-dom";

import Header from "../../navigations/Header";

import GIContainer from "../GIContainer";

import "./style.css";

class Page extends Component {
  constructor(props) {
    super(props);
    const activePage = props.location.pathname;

    if (process.env.NODE_ENV !== "development") {
      ReactGA.initialize("UA-140815372-1");
      ReactGA.pageview(activePage);
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  checkPropsVariables = activePage => {
    let { title, description, image, style } = this.props; // Variables

    return { style, title, description, image };
  };
  render() {
    const {
      children,
      className,
      homePage,
      location,
      testMode,
      user
    } = this.props; // Variables
    const activePage = location.pathname;

    const { style, title, description, image } = this.checkPropsVariables(
      activePage
    );

    return (
      <GIContainer
        className="screen-container"
        style={style}
        testMode={testMode}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`${title} | FlakyPeople`}</title>
          <meta name="title" content={`${title} | FlakyPeople`} />
          <meta name="og:title" content={`${title} | FlakyPeople`} />
          <meta name="description" content={description} />
          <meta name="og:description" content={description} />
          <meta property="image" content={image} />
          <meta property="og:image" content={image} />
        </Helmet>

        <GIContainer className={"x-fill " + className}>
          <Header />
          {children}
        </GIContainer>
      </GIContainer>
    );
  }
}

export default withRouter(Page);
