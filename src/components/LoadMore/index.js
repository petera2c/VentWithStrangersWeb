import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/pro-solid-svg-icons/faFire";

import LoadingHeart from "../loaders/Heart";

import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

let hasScrolled = false;

class LoadMore extends Component {
  componentDidMount() {
    this._ismounted = true;
    window.addEventListener("scroll", this.scrollListener);
  }
  componentWillUnmount() {
    this._ismounted = false;
    window.removeEventListener("scroll", this.scrollListener);
  }
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };
  scrollListener = () => {
    const { loadMore = () => {} } = this.props;

    if (
      window.innerHeight + window.scrollY + 5 >= document.body.scrollHeight &&
      !hasScrolled
    ) {
      hasScrolled = true;
      loadMore();
    }

    setTimeout(() => {
      hasScrolled = false;
    }, 1000);
  };
  render() {
    const { children, loadMore = () => {} } = this.props;

    return (
      <Container className="column x-fill full-center" onClick={loadMore}>
        {children}

        <LoadingHeart />
      </Container>
    );
  }
}

export default LoadMore;
