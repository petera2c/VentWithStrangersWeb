import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnalytics } from "@fortawesome/pro-duotone-svg-icons/faAnalytics";
import { faConciergeBell } from "@fortawesome/pro-duotone-svg-icons/faConciergeBell";
import { faFireAlt } from "@fortawesome/pro-duotone-svg-icons/faFireAlt";
import { faFire } from "@fortawesome/pro-solid-svg-icons/faFire";
import { faPen } from "@fortawesome/pro-solid-svg-icons/faPen";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faSearch } from "@fortawesome/pro-solid-svg-icons/faSearch";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons/faChevronDown";

import Consumer, { ExtraContext } from "../../context";

import Container from "../containers/Container";
import Text from "../views/Text";
import Input from "../views/Input";
import Button from "../views/Button";

import LoginModal from "../modals/Login";
import SignUpModal from "../modals/SignUp";

import { capitolizeFirstChar, isPageActive } from "../../util";

class Header extends Component {
  state = {
    loginModalBoolean: false,
    signUpModalBoolean: false,
    searchPostString: ""
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this.ismounted = false;
  }
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };

  searchPosts = searchPostString => {
    const { history } = this.props;

    this.handleChange({ searchPostString });
    history.push("/search?" + searchPostString);
  };

  render() {
    const {
      loginModalBoolean,
      signUpModalBoolean,
      searchPostString
    } = this.state;
    const { location } = this.props;
    const { pathname } = location;

    return (
      <Consumer>
        {context => (
          <Container className="sticky top-0 x-fill align-center justify-between wrap bg-white border-top large active pt16">
            <Container
              className="align-center wrap"
              style={{ paddingLeft: "calc(12.5vw - 8px)" }}
            >
              <Link
                className={
                  "button-3 mb16 mr16 " +
                  isPageActive("/trending", pathname) +
                  isPageActive("/", pathname)
                }
                to="/trending"
              >
                <FontAwesomeIcon className="mr8" icon={faAnalytics} />
                Trending
              </Link>
              <Link
                className={
                  "button-3 mb16 mx16 " + isPageActive("/recent", pathname)
                }
                to="/recent"
              >
                <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
                Recent
              </Link>
              <Link
                className={
                  "button-3 mb16 ml16 mr64 " +
                  isPageActive("/popular", pathname)
                }
                to="/popular"
              >
                <FontAwesomeIcon className="mr8" icon={faFireAlt} />
                Popular
              </Link>

              <Container className="border-all active py4 mr16 mb16 br4">
                <Link
                  className="border-right active blue px8"
                  to="/post-a-problem"
                >
                  <FontAwesomeIcon className="" icon={faPen} />
                </Link>
                <Link className="blue px8" to="/vent-to-a-stranger">
                  <FontAwesomeIcon className="" icon={faComments} />
                </Link>
              </Container>

              <Container className="full-center bg-grey-4 py4 px8 mb16 br4">
                <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
                <Input
                  className="no-border bg-grey-4 br4"
                  onChange={e => this.searchPosts(e.target.value)}
                  placeholder="Search"
                  type="text"
                  value={searchPostString}
                />
              </Container>
            </Container>

            <Container className="flex-fill justify-end mb16">
              {context.user && !context.user.password && (
                <Button
                  className="blue fw-300 mx32"
                  text="Login"
                  onClick={() => this.handleChange({ loginModalBoolean: true })}
                />
              )}
              {context.user && !context.user.password && (
                <Button
                  className="white blue-fade px32 py8 br4"
                  text="Sign Up"
                  onClick={() =>
                    this.handleChange({ signUpModalBoolean: true })
                  }
                />
              )}
              {context.user && context.user.password && (
                <Link className="flex full-center mr32" to="/activity">
                  <Text
                    className="round-icon bg-blue white mr8"
                    text={capitolizeFirstChar(context.user.displayName[0])}
                    type="h6"
                  />
                  <Text
                    className="mr8"
                    text={`Hello, ${capitolizeFirstChar(
                      context.user.displayName
                    )}`}
                    type="p"
                  />
                  <FontAwesomeIcon icon={faChevronDown} />
                </Link>
              )}
            </Container>

            {loginModalBoolean && (
              <LoginModal
                close={() => this.handleChange({ loginModalBoolean: false })}
                openSignUpModal={() =>
                  this.handleChange({
                    signUpModalBoolean: true,
                    loginModalBoolean: false
                  })
                }
              />
            )}
            {signUpModalBoolean && (
              <SignUpModal
                close={() => this.handleChange({ signUpModalBoolean: false })}
                openLoginModal={() =>
                  this.handleChange({
                    signUpModalBoolean: false,
                    loginModalBoolean: true
                  })
                }
              />
            )}
          </Container>
        )}
      </Consumer>
    );
  }
}
Header.contextType = ExtraContext;

export default withRouter(Header);
