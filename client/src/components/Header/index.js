import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Consumer, { ExtraContext } from "../../context";

import GIContainer from "../containers/GIContainer";

class Header extends Component {
  render() {
    return (
      <Consumer>
        {context => (
          <GIContainer
            className="sticky top-0 x-fill justify-end bg-blue py16"
            style={{ borderBottom: "1px solid white" }}
          >
            <Link className="white mx16" to="/sign-in">
              Sign In
            </Link>
            <Link className="white mx16" to="/sign-up">
              Sign Up
            </Link>
          </GIContainer>
        )}
      </Consumer>
    );
  }
}

export default withRouter(Header);
