import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import Consumer, { ExtraContext } from "../../context";

import { capitolizeFirstChar, isPageActive } from "../../util";

class AccountSection extends Component {
  componentDidMount() {
    const { location } = this.props;
    let search = { location };
    search = location.search.slice(1, search.length);
  }

  render() {
    const { location } = this.props;
    const { pathname, search } = location;

    return <Consumer>{context => <Container>activity</Container>}</Consumer>;
  }
}

AccountSection.contextType = ExtraContext;

export default withRouter(AccountSection);
