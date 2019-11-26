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

import VWSContainer from "../containers/VWSContainer";
import VWSText from "../views/VWSText";
import VWSInput from "../views/VWSInput";

class Header extends Component {
  state = {
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
    const { searchPostString } = this.state;
    return (
      <Consumer>
        {context => (
          <VWSContainer
            className="sticky top-0 x-fill full-center bg-white py16"
            style={{ borderBottom: "1px solid " }}
          >
            <Link className="no-border-button mx16" to="/trending">
              <FontAwesomeIcon className="" icon={faChartLine} />
              Trending
            </Link>
            <Link className="no-border-button mx16" to="/recents">
              <FontAwesomeIcon className="" icon={faClock} />
              Recents
            </Link>
            <Link className="no-border-button mx16" to="/popular">
              <FontAwesomeIcon className="" icon={faStar} />
              Popular
            </Link>
            <Link className="no-border-button mx16" to="/random">
              <FontAwesomeIcon className="" icon={faRedo} />
              Random
            </Link>

            <VWSContainer>
              <Link className="no-border-button mx16" to="/post-a-problem">
                <FontAwesomeIcon className="" icon={faPen} />
              </Link>
              <Link className="no-border-button mx16" to="/vent-to-a-stranger">
                <FontAwesomeIcon className="" icon={faComments} />
              </Link>
            </VWSContainer>

            <VWSContainer className="full-center">
              <FontAwesomeIcon className="" icon={faSearch} />
              <VWSInput
                className="py8 px16 mb8 br4"
                onChange={e =>
                  this.handleChange({ searchPostString: e.target.value })
                }
                placeholder="Search"
                type="text"
                value={searchPostString}
              />
            </VWSContainer>

            {context.user && !context.user.password && (
              <Link className="no-border-button mx16" to="/login">
                Login
              </Link>
            )}
            {context.user && !context.user.password && (
              <Link className="no-border-button mx16" to="/sign-up">
                Sign Up
              </Link>
            )}
            {context.user && context.user.password && (
              <VWSText
                className="absolute right-0  mr16"
                text={`Hello, ${context.user.password}`}
                type="p"
              />
            )}
          </VWSContainer>
        )}
      </Consumer>
    );
  }
}
Header.contextType = ExtraContext;

export default withRouter(Header);
