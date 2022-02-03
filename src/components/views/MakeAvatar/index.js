import React, { useEffect, useState } from "react";

function MakeAvatar({ className, displayName, size, userBasicInfo }) {
  const [capitolizedDisplayName, setCapitolizedDisplayName] = useState("");

  useEffect(() => {
    import("../../../util").then((functions) => {
      setCapitolizedDisplayName(
        functions.capitolizeFirstChar(
          displayName ? displayName : "Anonymous"
        )[0]
      );
    });
  }, [displayName]);

  if (userBasicInfo && userBasicInfo.avatar) {
    if (size === "large")
      return <div className={"avatar large " + className}></div>;
    else if (size === "small")
      return <div className={"avatar small mr8 " + className}></div>;
    else return <div className={"avatar mr8 " + className}></div>;
  } else {
    if (size === "large")
      return (
        <h1
          className={"avatar semi-large bg-blue white " + className}
          style={{ fontSize: "48px" }}
        >
          {capitolizedDisplayName}
        </h1>
      );
    else if (size === "small")
      return (
        <h6 className={"avatar very-small bg-blue white mr8 " + className}>
          {capitolizedDisplayName}
        </h6>
      );
    else
      return (
        <h6 className={"avatar small bg-blue white mr8 " + className}>
          {capitolizedDisplayName}
        </h6>
      );
  }
}

export default MakeAvatar;
