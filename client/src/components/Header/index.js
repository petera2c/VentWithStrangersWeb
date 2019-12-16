import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons/faChartLine";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { faRedo } from "@fortawesome/free-solid-svg-icons/faRedo";
import { faPen } from "@fortawesome/free-solid-svg-icons/faPen";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";

import Consumer, { ExtraContext } from "../../context";

import Container from "../containers/Container";
import Text from "../views/Text";
import Input from "../views/Input";
import Button from "../views/Button";

import LoginModal from "../modals/Login";
import SignUpModal from "../modals/SignUp";

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

  render() {
    const {
      loginModalBoolean,
      signUpModalBoolean,
      searchPostString
    } = this.state;

    return (
      <Consumer>
        {context => (
          <Container className="sticky top-0 x-fill full-center bg-white border-top large active py8">
            <Link className="no-border-button mx16" to="/trending">
              <FontAwesomeIcon className="mr8" icon={faChartLine} />
              Trending
            </Link>
            <Link className="no-border-button mx16" to="/recent">
              <FontAwesomeIcon className="mr8" icon={faClock} />
              Recent
            </Link>
            <Link className="no-border-button ml16 mr64" to="/popular">
              <FontAwesomeIcon className="mr8" icon={faStar} />
              Popular
            </Link>

            <Container className="border-all active py4 mr16 br4">
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

            <Container className="full-center bg-grey-4 py4 px8 br4">
              <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
              <Input
                className="no-border bg-grey-4 br4"
                onChange={e =>
                  this.handleChange({ searchPostString: e.target.value })
                }
                placeholder="Search"
                type="text"
                value={searchPostString}
              />
            </Container>

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
                onClick={() => this.handleChange({ signUpModalBoolean: true })}
              />
            )}
            {context.user && context.user.password && (
              <Text
                className="absolute right-0  mr16"
                text={`Hello, ${context.user.password}`}
                type="p"
              />
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
