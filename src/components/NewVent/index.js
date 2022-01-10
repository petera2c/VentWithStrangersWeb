import React, { useContext, useEffect, useState } from "react";

import { Statistic } from "antd";

const { Countdown } = Statistic;

import TextArea from "react-textarea-autosize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

import { UserContext } from "../../context";

import Container from "../containers/Container";
import Emoji from "../Emoji";
import StarterModal from "../modals/Starter";

import { userSignUpProgress } from "../../util";
import { getUserVentTimeOut, getVent, saveVent, updateTags } from "./util";

function NewVentComponent({ ventID }) {
  const { user } = useContext(UserContext);

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
    if (user) getUserVentTimeOut(setUserVentTimeOut, user.uid);
  }, []);

  return (
    <Container className="column bg-white br8">
      <Container className="column py32 px32 br4">
        <h5 className="fw-400 mb8">Title</h5>

        <input
          className="py8 px16 mb8 br4"
          onChange={e => {
            const userInteractionIssues = userSignUpProgress(user);

            if (userInteractionIssues) {
              if (userInteractionIssues === "NSI") setStarterModal(true);
              return;
            }
            setTitle(e.target.value);
            setSaving(false);
          }}
          placeholder="We are here for you."
          type="text"
          value={title}
        />
        <Container className="column relative mb8">
          <h5 className="fw-400 mb8">Tag this vent</h5>

          <input
            className="py8 px16 br4"
            onChange={e =>
              updateTags(
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
        </Container>
        <Container className="wrap">
          {tags.map((tag, index) => {
            let text = tag;
            if (tag.name) text = tag.name;

            return (
              <Container
                key={index}
                className="clickable mr8 mb8"
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
        </Container>

        <h5 className="fw-400 mb8">Description</h5>
        <TextArea
          className="py8 px16 mb8 br4"
          onChange={event => {
            const userInteractionIssues = userSignUpProgress(user);

            if (userInteractionIssues) {
              if (userInteractionIssues === "NSI") setStarterModal(true);
              return;
            }
            setDescription(event.target.value);
          }}
          placeholder="Let it all out. You are not alone."
          style={{ minHeight: "100px" }}
          value={description}
        />
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
              className="bg-blue white px64 py8 mb8 br4"
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
      </Container>
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
