import React from "react";
import Avatar from "avataaars";

import { capitolizeFirstChar } from "../../util";

function MakeAvatar({ displayName, size, userBasicInfo }) {
  if (!displayName) displayName = "Anonymous";
  //return <div />;

  if (userBasicInfo && userBasicInfo.avatar) {
    if (size === "large")
      return (
        <div className="avatar large">
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
            style={{ height: "100%" }}
          />
        </div>
      );
    else
      return (
        <div className="avatar mr8">
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
            style={{ height: "100%" }}
          />
        </div>
      );
  } else {
    if (size === "large")
      return (
        <h1
          className="avatar semi-large bg-blue white"
          style={{ fontSize: "48px" }}
        >
          {capitolizeFirstChar(displayName[0])}
        </h1>
      );
    else
      return (
        <h6 className="avatar small bg-blue white mr8">
          {capitolizeFirstChar(displayName[0])}
        </h6>
      );
  }
}

export default MakeAvatar;
