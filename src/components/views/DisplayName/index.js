import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import loadable from "@loadable/component";

const Container = loadable(() => import("../../containers/Container"));
const KarmaBadge = loadable(() => import("../../KarmaBadge"));
const MakeAvatar = loadable(() => import("../../MakeAvatar"));

function DisplayName({
  displayName,
  isLink = true,
  isUserOnline,
  noBadgeOnClick,
  userBasicInfo,
  userID,
}) {
  const [capitolizedDisplayName, setCapitolizedDisplayName] = useState(
    displayName ? displayName : "Anonymous"
  );

  useEffect(() => {
    import("../../../util").then((functions) => {
      setCapitolizedDisplayName(functions.capitolizeFirstChar(displayName));
    });
  }, []);

  if (isLink)
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
            <Container className="full-center flex-fill ov-hidden gap4">
              <h5 className="button-1 ellipsis fw-400 grey-11">
                {capitolizedDisplayName}
              </h5>
              {isUserOnline && <div className="online-dot" />}
            </Container>
          )}
        </Link>
        {userBasicInfo && (
          <KarmaBadge
            noOnClick={noBadgeOnClick}
            userBasicInfo={userBasicInfo}
          />
        )}
      </Container>
    );
  else
    return (
      <Container className="align-center flex-fill ov-hidden">
        <Container className="flex-fill align-center ov-hidden">
          <MakeAvatar
            displayName={userBasicInfo.displayName}
            userBasicInfo={userBasicInfo}
          />
          {userBasicInfo && (
            <Container className="full-center flex-fill ov-hidden gap4">
              <h5 className="ellipsis fw-400 grey-11">
                {capitolizedDisplayName}
              </h5>
            </Container>
          )}
        </Container>
      </Container>
    );
}

export default DisplayName;
