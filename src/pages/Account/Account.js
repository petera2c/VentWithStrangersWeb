import React, { useContext, useEffect, useState } from "react";
import moment from "moment-timezone";
import { Button, DatePicker, message } from "antd";

import { faBirthdayCake } from "@fortawesome/pro-duotone-svg-icons/faBirthdayCake";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faLockAlt } from "@fortawesome/pro-solid-svg-icons/faLockAlt";
import { faMonument } from "@fortawesome/pro-light-svg-icons/faMonument";
import { faPaperPlane } from "@fortawesome/pro-light-svg-icons/faPaperPlane";
import { faTransgenderAlt } from "@fortawesome/free-solid-svg-icons/faTransgenderAlt";
import { faVenusMars } from "@fortawesome/free-solid-svg-icons/faVenusMars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";
import Text from "../../components/views/Text";

import { UserContext } from "../../context";

import {
  educationList,
  kidsList,
  partyingList,
  politicalBeliefsList,
  religiousBeliefsList,
} from "../../PersonalOptions";
import { isMobileOrTablet, useIsMounted } from "../../util";
import { getUser, updateUser } from "./util";

function AccountSection() {
  const isMounted = useIsMounted();
  const { user, setUserBasicInfo } = useContext(UserContext);

  const [birthDate, setBirthDate] = useState();
  const [canSeePassword, setCanSeePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const [education, setEducation] = useState();
  const [kids, setKids] = useState();
  const [partying, setPartying] = useState();
  const [politics, setPolitics] = useState();
  const [religion, setReligion] = useState();

  const setAccountInfo = (userInfo) => {
    if (userInfo.gender) setGender(userInfo.gender);
    if (userInfo.pronouns) setPronouns(userInfo.pronouns);
    if (userInfo.birth_date) setBirthDate(new moment(userInfo.birth_date));
    if (userInfo.education !== undefined) setEducation(userInfo.education);
    if (userInfo.kids !== undefined) setKids(userInfo.kids);
    if (userInfo.partying !== undefined) setPartying(userInfo.partying);
    if (userInfo.politics !== undefined) setPolitics(userInfo.politics);
    if (userInfo.religion !== undefined) setReligion(userInfo.religion);
  };

  useEffect(() => {
    getUser((userInfo) => {
      if (isMounted()) setAccountInfo(userInfo);
      if (userInfo && isMounted()) setUserInfo(userInfo);
    }, user.uid);
  }, [isMounted, user]);

  return (
    <Page className="pa16" title="Account">
      <Container>
        <Container className="flex-fill column">
          <form
            className="flex-fill column bg-white pa16 mb2 br8"
            onSubmit={() => {}}
          >
            <Text
              className="blue bold mb16"
              text="Personal Information"
              type="h6"
            />
            <Container className="wrap">
              <Container
                className={
                  "column pr8 mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")
                }
              >
                <Text className="mb8" text="Display Name" type="p" />
                <Container className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faMonument} />
                  <input
                    className="x-fill no-border bg-grey-4 br4"
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Art Vandalay"
                    type="text"
                    value={displayName}
                  />
                </Container>
              </Container>
              <Container
                className={
                  "column pr8 mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")
                }
              >
                <Text className="mb8 " text="Email" type="p" />
                <Container className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faPaperPlane} />
                  <input
                    className="x-fill no-border bg-grey-4 br4"
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    placeholder="artvandalay@gmail.com"
                    type="text"
                    value={email}
                  />
                </Container>
              </Container>
            </Container>

            <Container className="wrap">
              <Container
                className={
                  "column pr8 mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")
                }
              >
                <Text className="mb8" text="Gender" type="p" />
                <Container className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faVenusMars} />
                  <FontAwesomeIcon
                    className="grey-5 mr8"
                    icon={faTransgenderAlt}
                  />
                  <input
                    className="x-fill no-border bg-grey-4 br4"
                    onChange={(e) => {
                      if (e.target.value.length > 50)
                        return alert(
                          "You can not write more than 50 characters for your gender"
                        );

                      setGender(e.target.value);
                    }}
                    placeholder="Any"
                    type="text"
                    value={gender}
                  />
                </Container>
              </Container>
              <Container
                className={
                  "column pr8 mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")
                }
              >
                <Text className="mb8 " text="Pronouns" type="p" />
                <Container className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faVenusMars} />
                  <FontAwesomeIcon
                    className="grey-5 mr8"
                    icon={faTransgenderAlt}
                  />
                  <input
                    autoComplete="off"
                    className="x-fill no-border bg-grey-4 br4"
                    onChange={(e) => {
                      if (e.target.value.length > 50)
                        return alert(
                          "You can not write more than 50 characters for your pronoun"
                        );

                      setPronouns(e.target.value);
                    }}
                    name="pronouns"
                    placeholder="she/her he/him its/them"
                    type="text"
                    value={pronouns}
                  />
                </Container>
              </Container>
            </Container>

            <Container className="x-fill wrap">
              <Container className="column pr8 mb16">
                <Container className="align-center justify-start py8">
                  <p className="mr8 mb8">Birthday</p>
                  <FontAwesomeIcon className="grey-5" icon={faBirthdayCake} />
                </Container>

                <Container className="align-center">
                  <DatePicker
                    value={
                      birthDate
                        ? moment(birthDate.format("YYYY/MM/DD"), "YYYY/MM/DD")
                        : null
                    }
                    format={"YYYY/MM/DD"}
                    onChange={(dateString) => {
                      if (!dateString) return setBirthDate(null);
                      const date = new moment(dateString);

                      const diffInYears = new moment().diff(date) / 31536000000;
                      if (diffInYears > 11) setBirthDate(date);
                      else
                        message.error(
                          "You are too young to use this application :'("
                        );
                    }}
                    size="large"
                  />
                </Container>

                <p className="mt32">
                  This information will be used to connect you with other users
                  with common interests. This information will not be sold or
                  shared with any 3rd party.
                </p>
                <Container className="x-fill column align-start justify-center py8 mt16">
                  <p className="mr8 mb8">Partying</p>
                  <Container className="gap8 wrap">
                    {partyingList.map((str, index) => {
                      return (
                        <Button
                          className={
                            "grey-1 border-all px8 py4 br4 " +
                            (partying === index ? "blue active" : "")
                          }
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            if (partying !== index) setPartying(index);
                            else setPartying(undefined);
                          }}
                          size="large"
                        >
                          {str}
                        </Button>
                      );
                    })}
                  </Container>
                </Container>

                <Container className="x-fill column align-start justify-center py8 mt16">
                  <p className="mr8 mb8">Political Beliefs</p>
                  <Container className="gap8 wrap">
                    {politicalBeliefsList.map((str, index) => {
                      return (
                        <Button
                          className={
                            "grey-1 border-all px8 py4 br4 " +
                            (politics === index ? "blue active" : "")
                          }
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();

                            if (politics !== index) setPolitics(index);
                            else setPolitics(undefined);
                          }}
                          size="large"
                        >
                          {str}
                        </Button>
                      );
                    })}
                  </Container>
                </Container>
                <Container className="x-fill column align-start justify-center py8 mt16">
                  <p className="mr8 mb8">Religious Beliefs</p>
                  <Container className="gap8 wrap">
                    {religiousBeliefsList.map((str, index) => {
                      return (
                        <Button
                          className={
                            "grey-1 border-all px8 py4 br4 " +
                            (religion === str ? "blue active" : "")
                          }
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();

                            if (religion !== str) setReligion(str);
                            else setReligion(undefined);
                          }}
                          size="large"
                        >
                          {str}
                        </Button>
                      );
                    })}
                  </Container>
                </Container>
                <Container className="x-fill column align-start justify-center py8 mt16">
                  <p className="mr8 mb8">Education</p>
                  <Container className="gap8 wrap">
                    {educationList.map((str, index) => {
                      return (
                        <Button
                          className={
                            "grey-1 border-all px8 py4 br4 " +
                            (education === index ? "blue active" : "")
                          }
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();

                            if (education !== index) setEducation(index);
                            else setEducation(undefined);
                          }}
                          size="large"
                        >
                          {str}
                        </Button>
                      );
                    })}
                  </Container>
                </Container>
                <Container className="x-fill column align-start justify-center py8 mt16">
                  <p className="mb8 mr8">Do you have kids?</p>
                  <Container className="gap8 wrap">
                    {kidsList.map((str, index) => {
                      return (
                        <Button
                          className={
                            "grey-1 border-all px8 py4 br4 " +
                            (kids === index ? "blue active" : "")
                          }
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();

                            if (kids !== index) setKids(index);
                            else setKids(undefined);
                          }}
                          size="large"
                        >
                          {str}
                        </Button>
                      );
                    })}
                  </Container>
                </Container>
              </Container>
            </Container>

            <Text
              className="blue bold mb16"
              text="Change your Password"
              type="h6"
            />

            <Container className="wrap">
              <Container
                className={
                  "column pr8 mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")
                }
              >
                <Text className="mb8 " text="New Password" type="p" />
                <Container className="full-center bg-grey-4 py4 px8 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faLockAlt} />

                  <input
                    autoComplete="off"
                    className="x-fill no-border bg-grey-4 br4"
                    name="password-change"
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="*******"
                    type={canSeePassword ? "" : "password"}
                    value={newPassword}
                  />
                </Container>
              </Container>
              <Container
                className={
                  "column mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")
                }
              >
                <Text className="mb8 " text="Confirm Password" type="p" />
                <Container className="align-center">
                  <Container className="flex-fill full-center bg-grey-4 py4 px8 br4">
                    <FontAwesomeIcon className="grey-5 mr8" icon={faLockAlt} />
                    <input
                      autoComplete="off"
                      className="x-fill no-border bg-grey-4 br4"
                      name="confirm-password-change"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="*******"
                      type={canSeePassword ? "" : "password"}
                      value={confirmPassword}
                    />
                  </Container>
                  <FontAwesomeIcon
                    className={
                      "clickable ml8 " + (canSeePassword ? "blue active" : "")
                    }
                    icon={faEye}
                    onClick={() => setCanSeePassword(!canSeePassword)}
                  />
                </Container>
              </Container>
            </Container>
          </form>
          <Container className="full-center bg-white pa16 br8">
            <Button
              className="flex full-center cancel py8 px32 mx4 br4"
              onClick={(e) => {
                setDisplayName(user.displayName);
                setEmail(user.email);
                setNewPassword("");
                setConfirmPassword("");
                setAccountInfo(userInfo);
              }}
              size="large"
            >
              Cancel
            </Button>
            <Button
              className="button-2 py8 px32 mx4 br4"
              onClick={() =>
                updateUser(
                  birthDate,
                  confirmPassword,
                  displayName,
                  education,
                  email,
                  gender,
                  kids,
                  newPassword,
                  partying,
                  politics,
                  pronouns,
                  religion,
                  setUserBasicInfo,
                  user,
                  userInfo
                )
              }
              size="large"
            >
              Apply
            </Button>
          </Container>
        </Container>
        <SubscribeColumn slot="1200594581" />
      </Container>
    </Page>
  );
}

export default AccountSection;
