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
import VWSButton from "../views/VWSButton";

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
          <VWSContainer className="sticky top-0 x-fill full-center bg-white border-top large active py8">
            <Link className="no-border-button mx16" to="/trending">
              <FontAwesomeIcon className="mr8" icon={faChartLine} />
              Trending
            </Link>
            <Link className="no-border-button mx16" to="/recents">
              <FontAwesomeIcon className="mr8" icon={faClock} />
              Recents
            </Link>
            <Link className="no-border-button mx16" to="/popular">
              <FontAwesomeIcon className="mr8" icon={faStar} />
              Popular
            </Link>
            <Link className="no-border-button ml16 mr64" to="/random">
              <FontAwesomeIcon className="mr8" icon={faRedo} />
              Random
            </Link>

            <VWSContainer className="border-all active py4 mr16 br4">
              <Link
                className="border-right active blue px8"
                to="/post-a-problem"
              >
                <FontAwesomeIcon className="" icon={faPen} />
              </Link>
              <Link className="blue px8" to="/vent-to-a-stranger">
                <FontAwesomeIcon className="" icon={faComments} />
              </Link>
            </VWSContainer>

            <VWSContainer className="full-center bg-grey-4 py4 px8 br4">
              <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
              <VWSInput
                className="no-border bg-grey-4 br4"
                onChange={e =>
                  this.handleChange({ searchPostString: e.target.value })
                }
                placeholder="Search"
                type="text"
                value={searchPostString}
              />
            </VWSContainer>

            {context.user && !context.user.password && (
              <VWSButton
                className="blue fw-300 mx32"
                text="Login"
                onClick={() => {}}
              />
            )}
            {context.user && !context.user.password && (
              <VWSButton
                className="white blue-fade px32 py8 br4"
                text="Sign Up"
                onClick={() => {}}
              />
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
