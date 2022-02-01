import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import loadable from "@loadable/component";

const Container = loadable(() => import("../../containers/Container"));
const KarmaBadge = loadable(() => import("../../KarmaBadge"));
const MakeAvatar = loadable(() => import("../../MakeAvatar"));

function DisplayName({ displayName, isUserOnline, userBasicInfo, userID }) {
  const [capitolizedDisplayName, setCapitolizedDisplayName] = useState(
    displayName ? displayName : "Anonymous"
  );

  useEffect(() => {
    import("../../../util").then((functions) => {
      setCapitolizedDisplayName(functions.capitolizeFirstChar(displayName));
    });
  }, []);

  return (
    <Container className="align-center flex-fill ov-hidden">
      <Link
        className="flex clickable align-center ov-hidden"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        to={"/profile?" + userID}
      >
        <MakeAvatar
          displayName={userBasicInfo.displayName}
          userBasicInfo={userBasicInfo}
        />
        {userBasicInfo && (
          <Container className="full-center flex-fill ov-hidden">
            <h5 className="button-1 ellipsis fw-400 mr8">
              {capitolizedDisplayName}
            </h5>
            {isUserOnline && <div className="online-dot mr8" />}
          </Container>
        )}
      </Link>
      {userBasicInfo && <KarmaBadge userBasicInfo={userBasicInfo} />}
    </Container>
  );
}

export default DisplayName;
