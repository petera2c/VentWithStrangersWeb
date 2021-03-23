import React, { Component } from "react";
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

  render() {
    const {
      children,
      className,
      homePage,
      location,
      testMode,
      style,
      user
    } = this.props; // Variables
    const activePage = location.pathname;

    return (
      <Container
        className={"column flex-fill " + className}
        style={style}
        testMode={testMode}
      >
        {children}
      </Container>
    );
  }
}

export default withRouter(Page);
