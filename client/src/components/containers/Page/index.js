import React, { Component } from "react";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga";
import { withRouter } from "react-router-dom";

import VWSContainer from "../VWSContainer";

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

    const { style, title, description, image } = this.checkPropsVariables(
      activePage
    );

    return (
      <VWSContainer
        className="screen-container"
        style={style}
        testMode={testMode}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`${title} | VentWithStrangers`}</title>
          <meta name="title" content={`${title} | VentWithStrangers`} />
          <meta name="og:title" content={`${title} | VentWithStrangers`} />
          <meta name="description" content={description} />
          <meta name="og:description" content={description} />
          <meta property="image" content={image} />
          <meta property="og:image" content={image} />
        </Helmet>

        <VWSContainer className={"x-fill " + className}>{children}</VWSContainer>
      </VWSContainer>
    );
  }
}

export default withRouter(Page);
