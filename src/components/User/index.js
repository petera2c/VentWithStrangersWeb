import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { Space } from "antd";

import { faBaby } from "@fortawesome/pro-solid-svg-icons/faBaby";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faGlassCheers } from "@fortawesome/pro-solid-svg-icons/faGlassCheers";
import { faLandmark } from "@fortawesome/pro-solid-svg-icons/faLandmark";
import { faPray } from "@fortawesome/pro-solid-svg-icons/faPray";
import { faSchool } from "@fortawesome/pro-solid-svg-icons/faSchool";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "../views/Button";
import Container from "../containers/Container";
import KarmaBadge from "../KarmaBadge";
import StarterModal from "../modals/Starter";
import MakeAvatar from "../MakeAvatar";

import { UserContext } from "../../context";

import { startConversation } from "../../components/Vent/util";
import {
  educationList,
  kidsList,
  partyingList,
  politicalBeliefsList,
} from "../../PersonalOptions";
import {
  calculateKarma,
  capitolizeFirstChar,
  getUserBasicInfo,
  useIsMounted,
  userSignUpProgress,
} from "../../util";

function UserComponent({
  additionalUserInfo,
  displayName,
  isOnline,
  lastOnline,
  showAdditionaluserInformation,
  showMessageUser,
  userID,
}) {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({ displayName });
  const [starterModal, setStarterModal] = useState(false);

  useEffect(() => {
    getUserBasicInfo((newUserInfo) => {
      if (isMounted) setUserInfo(newUserInfo);
    }, userID);
  }, [isMounted, userID]);

  return (
    <Link
      className="flex container twentyvw ov-hidden column bg-white pa16 mb16 br8"
      to={"/profile?" + userID}
    >
      <Container className="column x-fill flex-fill" direction="vertical">
        <Container className="x-fill full-center mb16">
          <MakeAvatar
            displayName={userInfo.displayName}
            size="large"
            userBasicInfo={userInfo}
          />
        </Container>

        <Container className="x-fill align-center wrap">
          <Container className="align-center mr8">
            {isOnline && <div className="online-dot mr8" />}
            <h1 className="primary ellipsis">{userInfo.displayName}</h1>
          </Container>
          <KarmaBadge userBasicInfo={userInfo} />
        </Container>
        <h6 className="grey-1 fw-400">
          {calculateKarma(userInfo)} Karma Points
        </h6>
        {(userInfo.birth_date || userInfo.gender || userInfo.pronouns) && (
          <Container>
            {Boolean(
              new moment().year() - new moment(userInfo.birth_date).year()
            ) && (
              <Container className="column">
                <h6 className="fw-400">Age</h6>
                <h6 className="grey-1 fw-400">
                  {new moment().year() - new moment(userInfo.birth_date).year()}
                </h6>
              </Container>
            )}
            {userInfo.gender && (
              <Container className="column ml8">
                <h6 className="fw-400">Gender</h6>
                <h6 className="grey-1 fw-400">{userInfo.gender}</h6>
              </Container>
            )}
            {userInfo.pronouns && (
              <Container className="column ml8">
                <h6 className="fw-400">Pronouns</h6>
                <h6 className="grey-1 fw-400">{userInfo.pronouns}</h6>
              </Container>
            )}
          </Container>
        )}

        {showAdditionaluserInformation && (
          <Space wrap>
            {additionalUserInfo.education !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faSchool} />
                  {educationList[additionalUserInfo.education]}
                </p>
              </Container>
            )}
            {additionalUserInfo.kids !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faBaby} />
                  {kidsList[additionalUserInfo.kids]}
                </p>
              </Container>
            )}
            {additionalUserInfo.partying !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faGlassCheers} />
                  {partyingList[additionalUserInfo.partying]}
                </p>
              </Container>
            )}
            {additionalUserInfo.politics !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faLandmark} />
                  {politicalBeliefsList[additionalUserInfo.politics]}
                </p>
              </Container>
            )}
            {additionalUserInfo.religion !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faPray} />
                  {additionalUserInfo.religion}
                </p>
              </Container>
            )}
          </Space>
        )}
        {showMessageUser && (
          <Container className="column flex-fill justify-end mt8">
            {(!user || (user && user.uid !== userID)) && (
              <Button
                className="x-fill button-2 px16 py8 br8"
                onClick={(e) => {
                  e.preventDefault();

                  const userInteractionIssues = userSignUpProgress(user);

                  if (userInteractionIssues) {
                    if (userInteractionIssues === "NSI") setStarterModal(true);
                    return;
                  }

                  startConversation(navigate, user, userID);
                }}
              >
                <FontAwesomeIcon className="mr8" icon={faComments} />
                <p className="inherit-color ellipsis">
                  Message {capitolizeFirstChar(userInfo.displayName)}
                </p>
              </Button>
            )}
            {lastOnline && (
              <p className="x-fill mt8">
                Last Seen: {moment(lastOnline).fromNow()}
              </p>
            )}
          </Container>
        )}
      </Container>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Link>
  );
}

export default UserComponent;
