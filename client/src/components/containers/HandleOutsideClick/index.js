import React, { Component } from "react";

import Container from "../Container";

class HandleOutsideClickContainer extends Component {
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    const { close } = this.props;
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) close();
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  render() {
    const { children } = this.props;
    return (
      <Container forwardedRef={this.setWrapperRef} {...this.props}>
        {children}
      </Container>
    );
  }
}

export default HandleOutsideClickContainer;
