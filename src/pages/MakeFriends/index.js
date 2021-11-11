import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import moment from "moment-timezone";
import Avatar from "avataaars";
import AdSense from "react-adsense";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faUserLock } from "@fortawesome/free-solid-svg-icons/faUserLock";
import { faPray } from "@fortawesome/free-solid-svg-icons/faPray";
import { faLandmark } from "@fortawesome/free-solid-svg-icons/faLandmark";
import { faBaby } from "@fortawesome/free-solid-svg-icons/faBaby";
import { faGlassCheers } from "@fortawesome/free-solid-svg-icons/faGlassCheers";
import { faSchool } from "@fortawesome/free-solid-svg-icons/faSchool";

import { UserContext } from "../../context";

import Page from "../../components/containers/Page";
import Button from "../../components/views/Button";
import Container from "../../components/containers/Container";

import KarmaBadge from "../../components/KarmaBadge";

import {
  calculateKarma,
  capitolizeFirstChar,
  isMobileOrTablet
} from "../../util";
import { startConversation } from "../../components/Vent/util";

import {
  educationList,
  kidsList,
  partyingList,
  politicalBeliefsList,
  religiousBeliefsList
} from "../PersonalOptions";

import { getUserInfo, getUserMatches, hasUserCompletedProfile } from "./util";

function MakeFriendsPage() {
  const history = useHistory();
  const user = useContext(UserContext);
  const [userInfo, setUserInfo] = useState({});
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (user)
      getUserInfo(newUserInfo => {
        setUserInfo(newUserInfo);
        if (hasUserCompletedProfile(newUserInfo))
          getUserMatches(setMatches, user.uid);
      }, user.uid);
  }, []);

  return (
    <Page
      className="bg-grey-2 align-center"
      description="Make friends online on vent with strangers!"
      keywords="Learn about Vent With Strangers"
      title="Make Friends"
    >
      <Container className="container full full-center mt16">
        <AdSense.Google
          className="adsbygoogle"
          client="ca-pub-5185907024931065"
          format=""
          responsive="true"
          slot="3444073995"
          style={{
            display: "block",
            minWidth: "100px",
            width: "100%",
            maxWidth: "2000px",
            minHeight: "100px",
            height: "150px",
            maxHeight: "200px"
          }}
        />
      </Container>
      <Container
        className={
          "column container bg-white pa32 mt32 mb32 br8 " +
          (isMobileOrTablet() ? "mobile-full mx16" : "large")
        }
      >
        <h1 className="primary tac mb16">Make Friends Online</h1>
        <h4 className="grey-1 tac">
          Making friends online has never been better! :) Tell us a little bit
          about yourself and we can help you make friends!
        </h4>
      </Container>
      {!user && (
        <Container className="container large column full-center">
          <h1>Error</h1>
          <h6>You must Login to see your matches!</h6>
        </Container>
      )}
      {user && !hasUserCompletedProfile(userInfo) && (
        <Container className="container large column full-center">
          <h1>Error</h1>
          <h6>
            You must completely fill in your{" "}
            <Link className="blue" to="/account">
              Profile
            </Link>{" "}
            to view your matches!
          </h6>
        </Container>
      )}
      {user && hasUserCompletedProfile(userInfo) && (
        <Container
          className={
            "wrap container justify-center gap16 mb32 " +
            (isMobileOrTablet() ? "mobile-full" : "full")
          }
        >
          {matches.map((matchedUserInfo, index) => {
            const displayName = matchedUserInfo.displayName
              ? capitolizeFirstChar(matchedUserInfo.displayName)
              : "Anonymous";

            return (
              <Link
                className={
                  "flex container twentyvw ov-hidden column bg-white pa16 mb16 br8 " +
                  (isMobileOrTablet() ? "" : "")
                }
                key={index}
                to={"/profile?" + matchedUserInfo.userID}
              >
                <Container className="x-fill full-center">
                  {matchedUserInfo && !matchedUserInfo.avatar && (
                    <Container
                      className="bg-blue full-center mb16 br-round"
                      style={{
                        height: "84px",
                        width: "84px"
                      }}
                    >
                      <h1 className="white fs-40">{displayName[0]}</h1>
                    </Container>
                  )}
                  {matchedUserInfo && matchedUserInfo.avatar && (
                    <Avatar
                      avatarStyle={"Circle"}
                      topType={matchedUserInfo.avatar.topType}
                      accessoriesType={matchedUserInfo.avatar.accessoriesType}
                      hairColor={matchedUserInfo.avatar.hairColor}
                      facialHairType={matchedUserInfo.avatar.facialHairType}
                      clotheType={matchedUserInfo.avatar.clotheType}
                      eyeType={matchedUserInfo.avatar.eyeType}
                      eyebrowType={matchedUserInfo.avatar.eyebrowType}
                      mouthType={matchedUserInfo.avatar.mouthType}
                      skinColor={matchedUserInfo.avatar.skinColor}
                      style={{ width: "96px", height: "96px" }}
                      className="mr8"
                    />
                  )}
                </Container>

                <Container className="align-center">
                  <h1 className="primary mr8">{displayName}</h1>
                  <KarmaBadge karma={calculateKarma(matchedUserInfo)} />
                </Container>
                <h6 className="grey-1 fw-400">
                  {calculateKarma(matchedUserInfo)} Karma Points
                </h6>
                <Container className="mt8">
                  {Boolean(
                    new moment().year() -
                      new moment(matchedUserInfo.birth_date).year()
                  ) && (
                    <Container className="column">
                      <h6 className="fw-400">Age</h6>
                      <h6 className="grey-1 fw-400">
                        {new moment().year() -
                          new moment(matchedUserInfo.birth_date).year()}
                      </h6>
                    </Container>
                  )}
                  {matchedUserInfo.gender && (
                    <Container className="column ml8">
                      <h6 className="fw-400">Gender</h6>
                      <h6 className="grey-1 fw-400">
                        {matchedUserInfo.gender}
                      </h6>
                    </Container>
                  )}
                  {matchedUserInfo.pronouns && (
                    <Container className="column ml8">
                      <h6 className="fw-400">Pronouns</h6>
                      <h6 className="grey-1 fw-400">
                        {matchedUserInfo.pronouns}
                      </h6>
                    </Container>
                  )}
                </Container>

                <Container className="wrap gap8 mt8">
                  {matchedUserInfo.education !== undefined && (
                    <Container className="border-all align-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faSchool} />
                      {educationList[matchedUserInfo.education]}
                    </Container>
                  )}
                  {matchedUserInfo.kids !== undefined && (
                    <Container className="border-all align-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faBaby} />
                      {kidsList[matchedUserInfo.kids]}
                    </Container>
                  )}
                  {matchedUserInfo.partying !== undefined && (
                    <Container className="border-all align-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faGlassCheers} />
                      {partyingList[matchedUserInfo.partying]}
                    </Container>
                  )}
                  {matchedUserInfo.politics !== undefined && (
                    <Container className="border-all align-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faLandmark} />
                      {politicalBeliefsList[matchedUserInfo.politics]}
                    </Container>
                  )}
                  {matchedUserInfo.religion !== undefined && (
                    <Container className="border-all align-center px8 py4 br4">
                      <FontAwesomeIcon className="mr8" icon={faPray} />
                      {matchedUserInfo.religion}
                    </Container>
                  )}
                </Container>
                <Container className="align-center justify-between mt16">
                  {matchedUserInfo.displayName && user && (
                    <Button
                      className="button-2 px16 py8 mr16 br8"
                      onClick={e => {
                        e.preventDefault();

                        if (!user)
                          alert("You must make an account to message user!");
                        startConversation(
                          history,
                          user.uid,
                          matchedUserInfo.userID
                        );
                      }}
                    >
                      <FontAwesomeIcon className="mr8" icon={faComments} />
                      Message User
                    </Button>
                  )}
                </Container>
              </Link>
            );
          })}
        </Container>
      )}
      {false && (
        <Container
          className={
            "container column wrap justify-center bg-white gap16 mb32 br8 " +
            (isMobileOrTablet() ? "mobile-full pa16" : "extra-large pa64")
          }
        >
          <h2 className="bold tac">Some Title</h2>
          <Container className="x-fill wrap gap16">
            <p className="container tiny flex-fill">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
            <p className="container tiny flex-fill">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
            <p className="container tiny flex-fill">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </Container>
        </Container>
      )}
    </Page>
  );
}

export default MakeFriendsPage;
