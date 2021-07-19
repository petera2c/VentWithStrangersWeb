import React, { Component, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../../context";

import TextArea from "react-textarea-autosize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";

import Text from "../../components/views/Text";
import Button from "../../components/views/Button";

import WarningModal from "../../components/modals/Warning";
import BlockModal from "../../components/modals/Block";

import Emoji from "../../components/Emoji";

import {
  calculateTimeToVentCounterReset,
  getHasUserPostedMoreThanTwiceToday,
  getVent,
  saveVent
} from "./util";
import { isMobileOrTablet } from "../../util";

function NewVentPage() {
  const history = useHistory();
  const location = useLocation();
  const { search } = location;
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState(0);
  const [
    hasUserPostedMoreThanTwiceToday,
    setHasUserPostedMoreThanTwiceToday
  ] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [title, setTitle] = useState("");
  const [ventID, setVentID] = useState(search ? search.substring(1) : null);
  const [warningModalIsActive, setWarningModalIsActive] = useState(true);
  const user = useContext(UserContext);

  useEffect(() => {
    if (ventID) getVent(setDescription, setTags, setTitle, ventID);
    if (user)
      getHasUserPostedMoreThanTwiceToday(
        setHasUserPostedMoreThanTwiceToday,
        user.uid
      );
  }, []);
  const updateTags = (inputText, tags) => {
    let word = "";
    for (let index in inputText) {
      if (inputText[index] === " " || inputText[index] === ",") {
        if (word) tags.push(word);
        word = "";
      } else word += inputText[index];
    }
    setTags(tags);
    setTagText(word);
    setSaving(false);
  };

  return (
    <Page
      className="column align-center bg-grey-2"
      description="You aren’t alone, and you should never feel alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you."
      keywords=""
      title="Vent To Strangers"
    >
      <Container
        className={
          "ov-visible column py32 " +
          (isMobileOrTablet()
            ? "container mobile-full px16"
            : "container large")
        }
      >
        <Text
          className="fw-600 mb16"
          text="Post Your Vent | Vent To Strangers"
          type="h4"
        />

        <Container className="column bg-white br8">
          <Container className="column py32 px32 br4">
            <Text className="fw-400 mb8" text="Title" type="h5" />

            <input
              className="py8 px16 mb8 br4"
              onChange={e => {
                setTitle(e.target.value);
                setSaving(false);
              }}
              placeholder="We are here for you."
              type="text"
              value={title}
            />
            <Container className="column relative mb8">
              <Text className="fw-400 mb8" text="Tag this vent" type="h5" />

              <input
                className="py8 px16 br4"
                onChange={e => updateTags(e.target.value, tags)}
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
                    <Text
                      className="flex-fill tac fw-300 border-all blue active large px16 py8"
                      style={{
                        marginRight: "1px",
                        borderTopLeftRadius: "4px",
                        borderBottomLeftRadius: "4px"
                      }}
                      text={text}
                      type="p"
                    />
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

            <Text className="fw-400 mb8" text="Description" type="h5" />
            <TextArea
              className="py8 px16 mb8 br4"
              onChange={event => setDescription(event.target.value)}
              placeholder="Let it all out. You are not alone."
              style={{ minHeight: "100px" }}
              value={description}
            />
            <Container className="justify-end">
              <Emoji
                handleChange={emoji => {
                  setDescription(description + emoji);
                }}
              />

              {!saving && (
                <Button
                  className="bg-blue white px64 py8 mb8 br4"
                  onClick={() => {
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
                  text="Submit"
                />
              )}
            </Container>
          </Container>
          <Container
            className="column pa32"
            style={{ borderTop: "2px solid var(--grey-color-2)" }}
          >
            <Text
              text="If you or someone you know  is in danger, call your local emergency services or police."
              type="p"
            />
          </Container>
        </Container>
      </Container>
      {warningModalIsActive && !user && (
        <WarningModal
          close={() => setWarningModalIsActive(false)}
          text="We are so sorry, but to moderate content we now require that all
              users must create accounts. It only takes 30 seconds to create an
              account and you can set the username to any random thing you think
              of. We do require your email address but that information will
              never be shared with anyone ever."
        />
      )}
      {hasUserPostedMoreThanTwiceToday && (
        <BlockModal
          text={
            "To avoid spam, users can only post two vents per day. Please come back " +
            calculateTimeToVentCounterReset()
          }
          title="Too Many Posts!"
        />
      )}
    </Page>
  );
}

export default NewVentPage;
