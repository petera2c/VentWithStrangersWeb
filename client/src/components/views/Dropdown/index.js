import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/pro-light-svg-icons";
import { faCheck } from "@fortawesome/pro-solid-svg-icons";

import GIContainer from "../../containers/GIContainer";
import GIText from "../GIText";

import { isActiveItem } from "./util";

import "./style.css";

class Dropdown extends Component {
  state = {
    showDropdown: false
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ showDropdown: false });
    }
  };
  render() {
    const { showDropdown } = this.state;
    const {
      activeItem,
      dropdownActiveDisplayClassName,
      className,
      dropdownClassName,
      dropdownItems,
      search,
      size,
      testMode,
      title
    } = this.props; // Variables
    const { handleParentChange } = this.props; // Functions

    return (
      <GIContainer
        className={`button ${className}  ${
          showDropdown ? dropdownActiveDisplayClassName : ""
        }`}
        onClick={() => this.setState({ showDropdown: !showDropdown })}
        forwardedRef={this.setWrapperRef}
        testMode={testMode}
      >
        <GIContainer className="dropdown-title-container align-center pr8">
          {title}
          <FontAwesomeIcon
            className="five-blue mx8"
            icon={faAngleDown}
            size={size}
          />
        </GIContainer>
        {showDropdown && (
          <GIContainer className={`dropdown ${dropdownClassName}`}>
            {dropdownItems.map((item, index) => (
              <GIText
                className={`flex align-center border-top px16 py8 ${isActiveItem(
                  activeItem,
                  index
                )}`}
                key={index}
                onClick={() => handleParentChange({ item, index })}
                type="h4"
              >
                {item}
                {isActiveItem(activeItem, index) && (
                  <GIContainer className="fill-flex justify-end">
                    <FontAwesomeIcon
                      className="round-icon-medium round bg-five-blue white pa4"
                      icon={faCheck}
                    />
                  </GIContainer>
                )}
              </GIText>
            ))}
          </GIContainer>
        )}
      </GIContainer>
    );
  }
}

export default Dropdown;
