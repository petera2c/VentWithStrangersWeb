import React from "react";
import Avatar from "avataaars";

import Container from "../containers/Container";

import { capitolizeFirstChar } from "../../util";

function MakeAvatar({ displayName, size, userBasicInfo }) {
  if (!displayName) displayName = "Anonymous";

  let width = "48px !important";
  let height = "48px !important";
  if (size === "large") {
    width = "96px";
    height = "96px";
  }

  if (userBasicInfo && userBasicInfo.avatar)
    return (
      <Avatar
        avatarStyle={"Circle"}
        topType={userBasicInfo.avatar.topType}
        accessoriesType={userBasicInfo.avatar.accessoriesType}
        hairColor={userBasicInfo.avatar.hairColor}
        facialHairType={userBasicInfo.avatar.facialHairType}
        clotheType={userBasicInfo.avatar.clotheType}
        eyeType={userBasicInfo.avatar.eyeType}
        eyebrowType={userBasicInfo.avatar.eyebrowType}
        mouthType={userBasicInfo.avatar.mouthType}
        skinColor={userBasicInfo.avatar.skinColor}
        style={{ width, height }}
        className="mr8"
      />
    );
  else if (size === "large")
    return (
      <Container
        className="bg-blue full-center br-round"
        style={{
          width: "84px",
          height: "84px",
        }}
      >
        <h1 className="white fs-40">{capitolizeFirstChar(displayName[0])}</h1>
      </Container>
    );
  else
    return (
      <h6 className="round-icon bg-blue white mr8" style={{ width, height }}>
        {capitolizeFirstChar(displayName[0])}
      </h6>
    );
}

export default MakeAvatar;
