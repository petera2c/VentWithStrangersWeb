import React, { useEffect, useState } from "react";
import Avatar from "avataaars";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHatWinter } from "@fortawesome/pro-duotone-svg-icons/faHatWinter";
import { faSunglasses } from "@fortawesome/pro-duotone-svg-icons/faSunglasses";
import { faPalette } from "@fortawesome/pro-duotone-svg-icons/faPalette";
import { faCut } from "@fortawesome/pro-duotone-svg-icons/faCut";
import { faUserTie } from "@fortawesome/pro-duotone-svg-icons/faUserTie";
import { faEye } from "@fortawesome/pro-duotone-svg-icons/faEye";
import { faPencil } from "@fortawesome/pro-duotone-svg-icons/faPencil";
import { faLips } from "@fortawesome/pro-duotone-svg-icons/faLips";

import Container from "../../../components/containers/Container";

import { getUserBasicInfo, isMobileOrTablet } from "../../../util";

import {
  accessoriesArray,
  clothesArray,
  eyebrowArray,
  eyesArray,
  facialHairArray,
  getActiveSection,
  hairColorArray,
  mouthArray,
  saveAvatar,
  skinArray,
  topArray
} from "./util";

function AvatarSection({ user }) {
  const [activeSection, setActiveSection] = useState(0);
  const [avatar, setAvatar] = useState({});
  const arraysArray = [
    topArray,
    accessoriesArray,
    hairColorArray,
    facialHairArray,
    clothesArray,
    eyesArray,
    eyebrowArray,
    mouthArray,
    skinArray
  ];

  useEffect(() => {
    if (user)
      getUserBasicInfo(userInfo => {
        if (userInfo && userInfo.avatar) setAvatar(userInfo.avatar);
      }, user.uid);
  }, []);

  return (
    <Container
      className={
        "container column px16 " +
        (isMobileOrTablet() ? "mobile-full" : "large")
      }
    >
      <h4 className="mb16">Create Your Avatar</h4>
      <Container className="gap16">
        <Container className="column bg-white pa16 br8">
          <button
            className={
              "flex align-center grey-1 gap8 mb16 " +
              (activeSection === 0 ? "blue" : "")
            }
            onClick={() => setActiveSection(0)}
          >
            <FontAwesomeIcon icon={faHatWinter} />
            Hair
          </button>
          <button
            className={
              "flex align-center grey-1 gap8 mb16 " +
              (activeSection === 1 ? "blue" : "")
            }
            onClick={() => setActiveSection(1)}
          >
            <FontAwesomeIcon icon={faSunglasses} />
            Accessories
          </button>
          <button
            className={
              "flex align-center grey-1 gap8 mb16 " +
              (activeSection === 2 ? "blue" : "")
            }
            onClick={() => setActiveSection(2)}
          >
            <FontAwesomeIcon icon={faPalette} />
            Hair Color
          </button>
          <button
            className={
              "flex align-center grey-1 gap8 mb16 " +
              (activeSection === 3 ? "blue" : "")
            }
            onClick={() => setActiveSection(3)}
          >
            <FontAwesomeIcon icon={faCut} />
            Facial Hair
          </button>
          <button
            className={
              "flex align-center grey-1 gap8 mb16 " +
              (activeSection === 4 ? "blue" : "")
            }
            onClick={() => setActiveSection(4)}
          >
            <FontAwesomeIcon icon={faUserTie} />
            Clothes
          </button>
          <button
            className={
              "flex align-center grey-1 gap8 mb16 " +
              (activeSection === 5 ? "blue" : "")
            }
            onClick={() => setActiveSection(5)}
          >
            <FontAwesomeIcon icon={faEye} />
            Eyes
          </button>
          <button
            className={
              "flex align-center grey-1 gap8 mb16 " +
              (activeSection === 6 ? "blue" : "")
            }
            onClick={() => setActiveSection(6)}
          >
            <FontAwesomeIcon icon={faPencil} />
            Eyebrows
          </button>
          <button
            className={
              "flex align-center grey-1 gap8 mb16 " +
              (activeSection === 7 ? "blue" : "")
            }
            onClick={() => setActiveSection(7)}
          >
            <FontAwesomeIcon icon={faLips} />
            Mouth
          </button>
          <button
            className={
              "flex align-center grey-1 gap8 " +
              (activeSection === 8 ? "blue" : "")
            }
            onClick={() => setActiveSection(8)}
          >
            <FontAwesomeIcon icon={faPalette} />
            Skin
          </button>
        </Container>
        <Container
          className="flex-fill column ov-auto bg-white br8"
          style={{ height: "394px" }}
        >
          {arraysArray[activeSection].map((str, index) => (
            <Container key={index}>
              <button
                className={
                  "flex-fill grey-1 py16 " +
                  (index !== arraysArray[activeSection].length - 1
                    ? "border-bottom "
                    : " ") +
                  (str === avatar[getActiveSection(activeSection)]
                    ? "blue"
                    : "")
                }
                onClick={() => {
                  avatar[getActiveSection(activeSection)] = str;
                  setAvatar({ ...avatar });
                }}
              >
                {str}
              </button>
            </Container>
          ))}
        </Container>
      </Container>
      <Container className="align-center justify-between mt16">
        <Avatar
          avatarStyle={"Circle"}
          topType={avatar.topType}
          accessoriesType={avatar.accessoriesType}
          hairColor={avatar.hairColor}
          facialHairType={avatar.facialHairType}
          clotheType={avatar.clotheType}
          eyeType={avatar.eyeType}
          eyebrowType={avatar.eyebrowType}
          mouthType={avatar.mouthType}
          skinColor={avatar.skinColor}
          style={{ width: "100px", height: "100px" }}
        />
        <button
          className="button-2 px16 py8 br4"
          onClick={() => saveAvatar(avatar, user.uid)}
        >
          Save Avatar
        </button>
      </Container>
    </Container>
  );
}

export default AvatarSection;
