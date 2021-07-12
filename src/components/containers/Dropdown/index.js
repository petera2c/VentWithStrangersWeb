import React, { useState } from "react";

import Container from "../Container";
import HandleOutsideClick from "../HandleOutsideClick";

function Dropdown({
  className,
  dropdownOptionClicked,
  dropdownOptions,
  style,
  value
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <HandleOutsideClick
      className={"relative border-all ov-visible clickable br4 " + className}
      close={() => setShowDropdown(false)}
    >
      <Container
        className="full-center pa4"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {value}
      </Container>
      {showDropdown && (
        <Container
          className="absolute column bg-white border-all ov-auto shadow-3"
          style={{
            top: "100%",
            left: 0,
            maxHeight: "200px",
            minWidth: "calc(100% + 16px)"
          }}
        >
          {dropdownOptions.map((dropdownOption, index) => (
            <Container
              className="no-text-wrap"
              key={index}
              onClick={() => {
                dropdownOptionClicked(dropdownOption);
                setShowDropdown(false);
              }}
            >
              <div>{dropdownOption}</div>
            </Container>
          ))}
        </Container>
      )}
    </HandleOutsideClick>
  );
}

export default Dropdown;
