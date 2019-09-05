import React, { Component } from "react";

import Consumer, { ExtraContext } from "../context";

import GIContainer from "../containers/GIContainer";

class Header extends Component {
  render() {
    return (
      <Consumer>
        {context => (
          <GIContainer className="fixed top-0 x-fill" testMode>
            hello world
          </GIContainer>
        )}
      </Consumer>
    );
  }
}

export default Header;
