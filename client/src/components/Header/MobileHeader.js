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
import { faBars } from "@fortawesome/pro-solid-svg-icons/faBars";
import { faUser } from "@fortawesome/pro-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-duotone-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/pro-duotone-svg-icons/faCog";

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
    mobileHeaderActive: false,
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
      mobileHeaderActive,
      signUpModalBoolean,
      searchPostString
    } = this.state;
    const { location } = this.props;
    const { pathname, search } = location;

    return (
      <Consumer>
        {context => (
          <Container className="sticky top-0 column x-fill full-center bg-white border-top large active shadow-2">
            <Container className="x-fill align-center justify-end border-bottom py8 px16">
              <Container className="border-all active py8 mr16 br4">
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
              <FontAwesomeIcon
                className="blue border-all active pa8 br4"
                icon={faBars}
                onClick={() =>
                  this.setState({ mobileHeaderActive: !mobileHeaderActive })
                }
              />
            </Container>
            {mobileHeaderActive && (
              <Container className="x-fill full-center">
                <Link
                  className={
                    "button-3 tac py16 mx16 " +
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
                    "button-3 tac py16 mx16 " +
                    isPageActive("/recent", pathname)
                  }
                  to="/recent"
                >
                  <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
                  Recent
                </Link>
                <Link
                  className={
                    "button-3 tac py16 mx16 " +
                    isPageActive("/popular", pathname)
                  }
                  to="/popular"
                >
                  <FontAwesomeIcon className="mr8" icon={faFireAlt} />
                  Popular
                </Link>
                <Link
                  className={
                    "button-3 tac py16 mx16 " +
                    isPageActive("/hot-tags", pathname)
                  }
                  to="/hot-tags"
                >
                  <FontAwesomeIcon className="mr8" icon={faFire} />
                  Hot Tags
                </Link>
              </Container>
            )}
            {mobileHeaderActive && (
              <Container className="column x-fill bg-grey-4">
                {context.user && context.user.password && (
                  <Container className="column">
                    <Link to="/activity">
                      <Container className="full-center py16 mx16">
                        <Text
                          className="round-icon bg-blue white mr8"
                          text={capitolizeFirstChar(
                            context.user.displayName[0]
                          )}
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
                      </Container>
                    </Link>
                    <Container className="bg-white x-fill">
                      <Link
                        className={
                          "button-3 tac py16 mx16 " +
                          isPageActive("/activity", pathname)
                        }
                        to={"/activity" + search}
                      >
                        <FontAwesomeIcon
                          className="mr8"
                          icon={faChartNetwork}
                        />
                        Activity
                      </Link>

                      <Link
                        className={
                          "button-3 tac py16 mx16 " +
                          isPageActive("/account", pathname)
                        }
                        to="/account"
                      >
                        <FontAwesomeIcon className="mr8" icon={faUser} />
                        Account
                      </Link>

                      <Link
                        className={
                          "button-3 tac py16 mx16 " +
                          isPageActive("/settings", pathname)
                        }
                        to="/settings"
                      >
                        <FontAwesomeIcon className="mr8" icon={faCog} />
                        Settings
                      </Link>
                    </Container>
                  </Container>
                )}
                <Container className="bg-white align-center py4 px8 ma16 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
                  <Input
                    className="no-border br4"
                    onChange={e => this.searchPosts(e.target.value)}
                    placeholder="Search"
                    type="text"
                    value={searchPostString}
                  />
                </Container>
                {context.user && !context.user.password && (
                  <Container className="x-fill">
                    <Button
                      className="x-50 blue fw-300 bg-white border-all active px32 mr8 br4"
                      text="Login"
                      onClick={() =>
                        this.handleChange({ loginModalBoolean: true })
                      }
                    />

                    <Button
                      className="x-50 white blue-fade px32 py8 ml8 br4"
                      text="Sign Up"
                      onClick={() =>
                        this.handleChange({ signUpModalBoolean: true })
                      }
                    />
                  </Container>
                )}
              </Container>
            )}

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
