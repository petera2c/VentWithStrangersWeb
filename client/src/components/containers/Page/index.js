import React, { Component } from "react";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga";
import { withRouter } from "react-router-dom";

import Container from "../Container";

import { isMobileOrTablet } from "../../../util";

import "./style.css";

class Page extends Component {
  constructor(props) {
    super(props);
    const activePage = props.location.pathname;

    if (process.env.NODE_ENV !== "development") {
      ReactGA.initialize("UA-140815372-2");
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

    const { description, image, style, title } = this.checkPropsVariables(
      activePage
    );

    return (
      <Container
        className={"column flex-fill " + className}
        style={style}
        testMode={testMode}
      >
        <Helmet defer={false}>
          <meta charSet="utf-8" />
          <title>{`${title}`}</title>
          <meta name="title" content={`${title}`} />
          <meta name="og:title" content={`${title}`} />
          <meta name="description" content={description} />
          <meta name="og:description" content={description} />
          <meta property="image" content={image} />
          <meta property="og:image" content={image} />
        </Helmet>
        {children}
      </Container>
    );
  }
}

export default withRouter(Page);
