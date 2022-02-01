import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextArea from "react-textarea-autosize";
import algoliasearch from "algoliasearch";
import { message, Space, Tooltip } from "antd";

import { faQuestionCircle } from "@fortawesome/pro-duotone-svg-icons/faQuestionCircle";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserContext } from "../../context";

import Container from "../containers/Container";
import Emoji from "../Emoji";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import MakeAvatar from "../../components/MakeAvatar";
import StarterModal from "../modals/Starter";

import {
  capitolizeFirstChar,
  canUserPost,
  countdown,
  formatSeconds,
  userSignUpProgress,
  viewTag,
} from "../../util";
import {
  createPlaceholderDescription,
  getQuote,
  getUserVentTimeOut,
  getVent,
  saveVent,
  selectEncouragingMessage,
  updateTags,
} from "./util";

const searchClient = algoliasearch(
  "N7KIA5G22X",
  "a2fa8c0a85b2020696d2da1780d7dfdb"
);
const tagsIndex = searchClient.initIndex("vent_tags");

function NewVentComponent({ isBirthdayPost, miniVersion, ventID }) {
  const isMounted = useRef(false);
  const navigate = useNavigate();
  const { user, userBasicInfo } = useContext(UserContext);

  const [description, setDescription] = useState("");
  const [encouragingText] = useState(selectEncouragingMessage());
  const [isMinified, setIsMinified] = useState(miniVersion);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState("");
  const [quote, setQuote] = useState();
  const [saving, setSaving] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [title, setTitle] = useState("");
  const [userVentTimeOut, setUserVentTimeOut] = useState(false);
  const [ventTags, setVentTags] = useState([]);

  useEffect(() => {
    isMounted.current = true;
    import("../../util").then((functions) => {
      setIsMobileOrTablet(functions.getIsMobileOrTablet());
    });

    tagsIndex
      .search("", {
        hitsPerPage: 10,
      })
      .then(({ hits }) => {
        setVentTags(
          hits.sort((a, b) => {
            if (a.display < b.display) return -1;
            if (a.display > b.display) return 1;
            return 0;
          })
        );
      });
    if (ventID) getVent(setDescription, setTags, setTitle, ventID);
    if (user)
      getUserVentTimeOut((res) => {
        if (res) {
          countdown(isMounted, res, setUserVentTimeOut);
          setInterval(
            () => countdown(isMounted, res, setUserVentTimeOut),
            1000
          );
        }
      }, user.uid);
    getQuote(isMounted, setQuote);

    return () => {
      isMounted.current = false;
    };
  }, [isMounted, user, ventID]);

  const checks = () => {
    if (userVentTimeOut && !ventID) return false;
    const userInteractionIssues = userSignUpProgress(user);

    if (userInteractionIssues) {
      if (userInteractionIssues === "NSI") setStarterModal(true);
      return false;
    }

    if (!canUserPost(userBasicInfo)) return false;

    return true;
  };

  return (
    <HandleOutsideClick
      className="x-fill column bg-white br8"
      close={() => {
        if (miniVersion) setIsMinified(true);
      }}
    >
      <Container
        className={"column br4 pa32 " + (isMinified ? "gap8" : "gap16")}
      >
        {!miniVersion && quote && (
          <Container className="column flex-fill align-center">
            <h1 className="fs-22 italic tac">"{quote.value}"</h1>
            <Link to={"/profile?" + quote.userID}>
              <p className="button-8 tac lh-1">
                - {capitolizeFirstChar(quote.displayName)}
              </p>
            </Link>
          </Container>
        )}
        {!miniVersion && userVentTimeOut > 0 && !ventID && (
          <Space direction="vertical">
            <p className="tac">
              To avoid spam, people can only post once every few hours. With
              more Karma Points you can post more often. Please come back in
            </p>
            <h1 className="tac">{formatSeconds(userVentTimeOut)}</h1>
          </Space>
        )}
        <Container className="align-center">
          {(!isMobileOrTablet || (isMobileOrTablet && isMinified)) && (
            <Link to="/avatar">
              <MakeAvatar
                displayName={userBasicInfo.displayName}
                userBasicInfo={userBasicInfo}
              />
            </Link>
          )}
          <TextArea
            className="x-fill py8 px16 br4"
            onChange={(event) => {
              if (!checks()) return;

              setDescription(event.target.value);
            }}
            onClick={() => setIsMinified(false)}
            placeholder={createPlaceholderDescription(
              encouragingText,
              isBirthdayPost,
              userVentTimeOut
            )}
            minRows={isMinified ? 1 : 3}
            value={description}
          />
          {!isMobileOrTablet && (
            <Emoji
              handleChange={(emoji) => {
                const userInteractionIssues = userSignUpProgress(user);

                if (userInteractionIssues) {
                  if (userInteractionIssues === "NSI") setStarterModal(true);
                  return;
                }

                setDescription(description + emoji);
              }}
            />
          )}
        </Container>
        {!isMinified && (
          <Space className="x-fill" direction="vertical">
            <h5 className="fw-400">Title</h5>
            <input
              className="x-fill py8 px16 br4"
              onChange={(e) => {
                if (!checks()) return;
                setTitle(e.target.value);
                setSaving(false);
              }}
              placeholder="Our community is listening :)"
              type="text"
              value={title}
            />
          </Space>
        )}
        {!isMinified && (
          <Space className="x-fill" direction="vertical">
            <h5 className="fw-400">Tag this vent</h5>

            <input
              className="x-fill py8 px16 br4"
              onChange={(e) => {
                if (!checks()) return;

                tagsIndex
                  .search(e.target.value, {
                    hitsPerPage: 10,
                  })
                  .then(({ hits }) => {
                    setVentTags(hits);
                  });

                setTagText(e.target.value);
              }}
              placeholder="Search tags"
              type="text"
              value={tagText}
            />
            {ventTags && ventTags.length > 0 && (
              <Container className="wrap gap8">
                {ventTags.map((tagHit, index) => (
                  <button
                    className="button-10 br4 px8 py4"
                    key={tagHit.objectID}
                    onClick={() => {
                      if (!checks) return;
                      if (tags && tags.length >= 3) {
                        message.info(
                          "You can not set more than 3 tags in a vent!"
                        );
                        return tags;
                      }
                      updateTags(setTags, tagHit);
                    }}
                  >
                    {viewTag(tagHit.objectID)}
                  </button>
                ))}
              </Container>
            )}
          </Space>
        )}
        {!isMinified && tags && tags.length > 0 && (
          <Container className="column gap8">
            <h5>Slected Tags</h5>
            <Container className="x-fill wrap gap8">
              {tags.map((tag, index) => (
                <Container
                  key={tag.objectID}
                  className="button-2 br4 gap8 pa8"
                  onClick={() => {
                    let temp = [...tags];
                    temp.splice(index, 1);
                    setTags(temp);
                  }}
                >
                  <p className="ic flex-fill">{viewTag(tag.objectID)}</p>

                  <FontAwesomeIcon icon={faTimes} />
                </Container>
              ))}
            </Container>
          </Container>
        )}

        {!isMinified && (
          <Container className="justify-end">
            {!saving && (
              <button
                className="bg-blue white px64 py8 br4"
                onClick={() => {
                  const userInteractionIssues = userSignUpProgress(user);

                  if (userInteractionIssues) {
                    if (userInteractionIssues === "NSI") setStarterModal(true);
                    return;
                  }

                  if (description && title) {
                    setTagText("");
                    setSaving(true);

                    saveVent(
                      (vent) => {
                        setSaving(false);
                        navigate(
                          "/vent/" +
                            vent.id +
                            "/" +
                            vent.title
                              .replace(/[^a-zA-Z ]/g, "")
                              .replace(/ /g, "-")
                              .toLowerCase()
                        );
                      },
                      checks,
                      isBirthdayPost,
                      tags,
                      {
                        description,
                        title,
                      },
                      ventID,
                      user
                    );
                  } else message.error("One or more fields is missing :'(");
                }}
              >
                Submit
              </button>
            )}
          </Container>
        )}
        {isMinified && quote && (
          <Container className="flex-fill full-center">
            <Container className="column flex-fill align-center">
              <p className="container medium italic tac">{quote.value}</p>
              <Link to={"/profile?" + quote.userID}>
                <p className="blue tac lh-1">
                  - {capitolizeFirstChar(quote.displayName)}
                </p>
              </Link>
            </Container>
            <Tooltip
              placement="bottom"
              title="Win the Feel Good Quote Contest to have your quote featured here :)"
            >
              <Link to="/quote-contest">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </Link>
            </Tooltip>
          </Container>
        )}
      </Container>
      {!miniVersion && (
        <Container
          className="column pa32"
          style={{ borderTop: "2px solid var(--grey-color-2)" }}
        >
          <p>
            If you or someone you know is in danger, call your local emergency
            services or police.
          </p>
        </Container>
      )}
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </HandleOutsideClick>
  );
}

export default NewVentComponent;
