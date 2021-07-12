import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faLockAlt } from "@fortawesome/pro-solid-svg-icons/faLockAlt";
import { faPaperPlane } from "@fortawesome/pro-light-svg-icons/faPaperPlane";
import { faMonument } from "@fortawesome/pro-light-svg-icons/faMonument";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faVenusMars } from "@fortawesome/free-solid-svg-icons/faVenusMars";
import { faTransgenderAlt } from "@fortawesome/free-solid-svg-icons/faTransgenderAlt";
import { faBirthdayCake } from "@fortawesome/pro-duotone-svg-icons/faBirthdayCake";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Dropdown from "../../components/containers/Dropdown";
import Text from "../../components/views/Text";
import Button from "../../components/views/Button";

import { isMobileOrTablet } from "../../util";
import { getUser, updateUser } from "./util";

function createMonthArray(days) {
  let array = [];
  for (let day = 1; day <= days; day++) {
    array.push(day);
  }
  return array;
}
function createYearArray(year) {
  let array = [];
  for (let i = year - 110; i < year - 5; i++) {
    array.push(i);
  }
  return array;
}

function AccountSection({ user }) {
  const history = useHistory();
  if (!user) {
    history.push("/");
    return <div />;
  }

  const [birthDate, setBirthDate] = useState(new moment());
  const [canSeePassword, setCanSeePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    getUser(userInfo => {
      if (userInfo.gender) setGender(userInfo.gender);
      if (userInfo.pronouns) setPronouns(userInfo.pronouns);
      if (userInfo.birth_date) setBirthDate(new moment(userInfo.birth_date));
      if (userInfo) setUserInfo(userInfo);
    }, user.uid);
  }, []);

  return (
    <Container
      className={
        "container column px16 " +
        (isMobileOrTablet() ? "mobile-full" : "large")
      }
    >
      <Text className="mb16" text="Account" type="h4" />
      <Container className="column bg-white pa16 mb2 br8">
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
                onChange={e => setDisplayName(e.target.value)}
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
                onChange={e => setEmail(e.target.value)}
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
              <FontAwesomeIcon className="grey-5 mr8" icon={faTransgenderAlt} />
              <input
                className="x-fill no-border bg-grey-4 br4"
                onChange={e => {
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
              <FontAwesomeIcon className="grey-5 mr8" icon={faTransgenderAlt} />
              <input
                className="x-fill no-border bg-grey-4 br4"
                onChange={e => {
                  if (e.target.value.length > 50)
                    return alert(
                      "You can not write more than 50 characters for your gender"
                    );

                  setPronouns(e.target.value);
                }}
                placeholder="she/her he/him its/them"
                type="text"
                value={pronouns}
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
            <Container className="align-center justify-start py8">
              <p className="mr8">Birthday</p>
              <FontAwesomeIcon className="grey-5" icon={faBirthdayCake} />
            </Container>
            <Container className="align-center">
              <Container className="relative full-center column">
                <p className="mb4">Day</p>
                <Dropdown
                  dropdownOptionClicked={day =>
                    setBirthDate(new moment(birthDate).set("date", day))
                  }
                  dropdownOptions={createMonthArray(birthDate.daysInMonth())}
                  value={birthDate.date()}
                />
              </Container>
              <Container className="relative full-center column ml8">
                <p className="mb4">Month</p>
                <Dropdown
                  dropdownOptionClicked={month =>
                    setBirthDate(new moment(birthDate).set("month", month - 1))
                  }
                  dropdownOptions={createMonthArray(12)}
                  value={birthDate.month() + 1}
                />
              </Container>
              <Container className="relative full-center column ml8">
                <p className="mb4">Year</p>
                <Dropdown
                  dropdownOptionClicked={year =>
                    setBirthDate(new moment(birthDate).set("year", year))
                  }
                  dropdownOptions={createYearArray(new moment().year())}
                  value={birthDate.year()}
                />
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
                className="x-fill no-border bg-grey-4 br4"
                onChange={e => setNewPassword(e.target.value)}
                placeholder="*******"
                type={canSeePassword ? "" : "password"}
                value={newPassword}
              />
            </Container>
          </Container>
          <Container
            className={"column mb16 " + (isMobileOrTablet() ? "x-100" : "x-50")}
          >
            <Text className="mb8 " text="Confirm Password" type="p" />
            <Container className="align-center">
              <Container className="flex-fill full-center bg-grey-4 py4 px8 br4">
                <FontAwesomeIcon className="grey-5 mr8" icon={faLockAlt} />
                <input
                  className="x-fill no-border bg-grey-4 br4"
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="*******"
                  type={canSeePassword ? "" : "password"}
                  value={confirmPassword}
                />
              </Container>
              <FontAwesomeIcon
                className={"clickable ml8 " + (canSeePassword ? "blue" : "")}
                icon={faEye}
                onClick={() => setCanSeePassword(!canSeePassword)}
              />
            </Container>
          </Container>
        </Container>
      </Container>
      <Container className="full-center bg-white pa16 br8">
        <Button
          className="cancel py8 px32 mx4 br4"
          text="Cancel"
          onClick={() => {
            setDisplayName(user.displayName);
            setEmail(user.email);
            setNewPassword("");
            setConfirmPassword("");
          }}
        />
        <Button
          className="button-2 py8 px32 mx4 br4"
          text="Apply"
          onClick={() =>
            updateUser(
              birthDate,
              confirmPassword,
              displayName,
              email,
              gender,
              newPassword,
              pronouns,
              user,
              userInfo
            )
          }
        />
      </Container>
    </Container>
  );
}

export default AccountSection;
