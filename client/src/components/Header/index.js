import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Consumer, { ExtraContext } from "../../context";

import GIContainer from "../containers/GIContainer";
import GIText from "../views/GIText";

class Header extends Component {
  render() {
    return (
      <Consumer>
        {context => (
          <GIContainer
            className="sticky top-0 x-fill full-center bg-blue py16"
            style={{ borderBottom: "1px solid white" }}
          >
            <Link className="white mx16" to="/home">
              Home
            </Link>
            <Link className="white mx16" to="/post-a-problem">
              Post a Problem
            </Link>
            <Link className="white mx16" to="/vent-to-a-stranger">
              Vent with a Stranger
            </Link>
            {context.user &&
              context.user.displayName &&
              !context.user.displayName.match(/[a-z]/i) && (
                <Link className="white mx16" to="/sign-in">
                  Sign In
                </Link>
              )}
            {context.user &&
              context.user.displayName &&
              !context.user.displayName.match(/[a-z]/i) && (
                <Link className="white mx16" to="/sign-up">
                  Sign Up
                </Link>
              )}
            {context.user &&
              context.user.displayName &&
              context.user.displayName.match(/[a-z]/i) && (
                <GIText
                  className="absolute right-0 white mr16"
                  text={`Hello, ${context.user.displayName}`}
                  type="p"
                />
              )}
          </GIContainer>
        )}
      </Consumer>
    );
  }
}

export default withRouter(Header);
