import React, { useContext, useEffect, useState } from "react";
import { Space, Statistic } from "antd";
const { Countdown } = Statistic;
import TextArea from "react-textarea-autosize";
import { useHistory } from "react-router-dom";
import moment from "moment-timezone";

import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserContext } from "../../context";

import Container from "../containers/Container";
import Emoji from "../Emoji";
import MakeAvatar from "../../components/MakeAvatar";
import StarterModal from "../modals/Starter";

import { userSignUpProgress } from "../../util";
import { getUserVentTimeOut, getVent, saveVent, updateTags } from "./util";

function NewVentComponent({ miniVersion, ventID }) {
  const history = useHistory();
  const { user, userBasicInfo } = useContext(UserContext);

  const [description, setDescription] = useState("");
  const [gender, setGender] = useState(0);
  const [userVentTimeOut, setUserVentTimeOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [title, setTitle] = useState("");
  const [starterModal, setStarterModal] = useState(false);

  useEffect(() => {
    if (ventID) getVent(setDescription, setTags, setTitle, ventID);
    if (user)
      getUserVentTimeOut(res => {
        if (res) {
          const doSomething = () => {
            setUserVentTimeOut(oldUserVentTimeOut => {
              if (oldUserVentTimeOut)
                return new moment(oldUserVentTimeOut).subtract(1, "seconds");
              else return new moment(res);
            });
          };

          doSomething();
          setInterval(doSomething, 1000);
        }
      }, user.uid);
  }, []);

  const checks = () => {
    if (userVentTimeOut) return false;
    const userInteractionIssues = userSignUpProgress(user);

    if (userInteractionIssues) {
      if (userInteractionIssues === "NSI") setStarterModal(true);
      return false;
    }

    return true;
  };

  if (miniVersion)
    return (
      <Container className="x-fill column bg-white pa16 br8">
        <Space align="center">
          <MakeAvatar userBasicInfo={userBasicInfo} />
          <input
            className="flex-fill py8 px16 br4"
            onChange={e => {
              if (!checks()) return;

              setTitle(e.target.value);
              setSaving(false);
            }}
            placeholder="We are here for you."
            type="text"
            value={title}
          />
          {starterModal && (
            <StarterModal
              activeModal={starterModal}
              setActiveModal={setStarterModal}
            />
          )}
        </Space>
      </Container>
    );

  return (
    <Container className="x-fill column bg-white br8">
      <Space className="pa32 br4" direction="vertical" size="large">
        {userVentTimeOut && (
          <Space direction="vertical">
            <p className="tac">
              To avoid spam, people can only post once every few hours. With
              more Karma Points you can post more often. Please come back in
            </p>
            <h1 className="tac">{userVentTimeOut.format("hh:mm:ss")}</h1>
          </Space>
        )}
        <Space className="x-fill" direction="vertical">
          <h5 className="fw-400">Title</h5>
          <input
            className="x-fill py8 px16 br4"
            onChange={e => {
              if (!checks()) return;
              setTitle(e.target.value);
              setSaving(false);
            }}
            placeholder="We are here for you."
            type="text"
            value={title}
          />
        </Space>
        <Space className="x-fill" direction="vertical">
          <h5 className="fw-400">Tag this vent</h5>

          <input
            className="x-fill py8 px16 br4"
            onChange={e =>
              updateTags(
                checks,
                e.target.value,
                setSaving,
                setStarterModal,
                setTags,
                setTagText,
                tags,
                user
              )
            }
            placeholder="depression, relationships, covid-19"
            type="text"
            value={tagText}
          />
        </Space>
        <Space className="x-fill">
          {tags.map((tag, index) => {
            let text = tag;
            if (tag.name) text = tag.name;

            return (
              <Container
                key={index}
                className="clickable"
                onClick={() => {
                  let temp = [...tags];
                  temp.splice(index, 1);

                  setSaving(false);
                  setTags(temp);
                }}
              >
                <p
                  className="flex-fill tac fw-300 border-all blue active large px16 py8"
                  style={{
                    marginRight: "1px",
                    borderTopLeftRadius: "4px",
                    borderBottomLeftRadius: "4px"
                  }}
                >
                  {text}
                </p>
                <Container
                  className="full-center border-all px16"
                  style={{
                    borderTopRightRadius: "4px",
                    borderBottomRightRadius: "4px"
                  }}
                >
                  <FontAwesomeIcon className="" icon={faTimes} />
                </Container>
              </Container>
            );
          })}
        </Space>

        <Space className="x-fill" direction="vertical">
          <h5 className="fw-400">Description</h5>
          <TextArea
            className="x-fill py8 px16 br4"
            onChange={event => {
              if (!checks()) return;

              setDescription(event.target.value);
            }}
            placeholder="Let it all out. You are not alone."
            style={{ minHeight: "100px" }}
            value={description}
          />
        </Space>
        <Container className="justify-end">
          <Emoji
            handleChange={emoji => {
              const userInteractionIssues = userSignUpProgress(user);

              if (userInteractionIssues) {
                if (userInteractionIssues === "NSI") setStarterModal(true);
                return;
              }

              setDescription(description + emoji);
            }}
          />

          {!saving && (
            <button
              className="bg-blue white px64 py8 br4"
              onClick={() => {
                const userInteractionIssues = userSignUpProgress(user);

                if (userInteractionIssues) {
                  if (userInteractionIssues === "NSI") setStarterModal(true);
                  return;
                }

                if (tagText) tags.push(tagText);
                if (description && title) {
                  setTagText("");
                  setSaving(true);

                  saveVent(
                    vent => {
                      setSaving(false);
                      history.push(
                        "/problem/" +
                          vent.id +
                          "/" +
                          vent.title
                            .replace(/[^a-zA-Z ]/g, "")
                            .replace(/ /g, "-")
                            .toLowerCase()
                      );
                    },
                    {
                      description,
                      gender,
                      tags,
                      title
                    },
                    ventID,
                    user
                  );
                } else alert("One or more fields is missing.");
              }}
            >
              Submit
            </button>
          )}
        </Container>
      </Space>
      <Container
        className="column pa32"
        style={{ borderTop: "2px solid var(--grey-color-2)" }}
      >
        <p>
          If you or someone you know is in danger, call your local emergency
          services or police.
        </p>
      </Container>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Container>
  );
}

export default NewVentComponent;
