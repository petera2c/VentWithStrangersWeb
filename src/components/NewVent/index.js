import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loadable from "@loadable/component";
import TextArea from "react-textarea-autosize";
import algoliasearch from "algoliasearch";
import { message, Space, Tooltip } from "antd";

import { faQuestionCircle } from "@fortawesome/pro-duotone-svg-icons/faQuestionCircle";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import StarterModal from "../modals/Starter";

import { UserContext } from "../../context";

import {
  capitolizeFirstChar,
  countdown,
  getIsMobileOrTablet,
  isUserKarmaSufficient,
  useIsMounted,
  viewTagFunction,
} from "../../util";
import {
  checkVentTitle,
  getQuote,
  getUserVentTimeOut,
  getVent,
  selectEncouragingMessage,
} from "./util";
import { checks } from "./util";

const Emoji = loadable(() => import("../Emoji"));
const MakeAvatar = loadable(() => import("../views/MakeAvatar"));

const searchClient = algoliasearch(
  "N7KIA5G22X",
  "a2fa8c0a85b2020696d2da1780d7dfdb"
);
const tagsIndex = searchClient.initIndex("vent_tags");

const TITLE_LENGTH_MINIMUM = 0;
const TITLE_LENGTH_MAXIMUM = 100;

function NewVentComponent({ isBirthdayPost, miniVersion, ventID }) {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { user, userBasicInfo } = useContext(UserContext);

  const [description, setDescription] = useState("");
  const [isMinified, setIsMinified] = useState(miniVersion);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState();
  const [quote, setQuote] = useState();
  const [saving, setSaving] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [title, setTitle] = useState("");
  const [userVentTimeOut, setUserVentTimeOut] = useState(false);
  const [userVentTimeOutFormatted, setUserVentTimeOutFormatted] = useState("");
  const [ventTags, setVentTags] = useState([]);

  const [hasStartedToWriteVent, setHasStartedToWriteVent] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [postingDisableFunction, setPostingDisableFunction] = useState();

  useEffect(() => {
    let interval;

    if (isMounted()) {
      setPlaceholderText(selectEncouragingMessage());
      setIsMobileOrTablet(getIsMobileOrTablet());
    }

    tagsIndex
      .search("", {
        hitsPerPage: 10,
      })
      .then(({ hits }) => {
        if (isMounted())
          setVentTags(
            hits.sort((a, b) => {
              if (a.display < b.display) return -1;
              if (a.display > b.display) return 1;
              return 0;
            })
          );
      });

    if (ventID) getVent(isMounted, setDescription, setTags, setTitle, ventID);

    getQuote(isMounted, setQuote);

    if (user) {
      getUserVentTimeOut((res) => {
        const temp = checks(
          isUserKarmaSufficient(userBasicInfo),
          setStarterModal,
          user,
          userBasicInfo,
          ventID,
          res
        );
        if (isMounted()) setPostingDisableFunction(temp);

        if (res) {
          interval = setInterval(
            () =>
              countdown(
                isMounted,
                res,
                setUserVentTimeOut,
                setUserVentTimeOutFormatted
              ),
            1000
          );
        }
      }, user.uid);
    } else {
      const temp = checks(
        true,
        setStarterModal,
        user,
        userBasicInfo,
        ventID,
        false
      );
      if (isMounted()) setPostingDisableFunction(temp);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMounted, user, userBasicInfo, ventID]);

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
            <h1 className="tac">{userVentTimeOutFormatted}</h1>
          </Space>
        )}
        <Container className="align-center gap8">
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
              if (postingDisableFunction) return postingDisableFunction();

              setDescription(event.target.value);
            }}
            onClick={() => {
              setIsMinified(false);
              setHasStartedToWriteVent(true);
            }}
            placeholder={
              isBirthdayPost
                ? "Have the best birthday ever!"
                : userVentTimeOutFormatted
                ? "You can vent again in " + userVentTimeOutFormatted
                : placeholderText
            }
            minRows={isMinified ? 1 : 3}
            value={description}
          />
          {!isMobileOrTablet && hasStartedToWriteVent && (
            <Emoji
              handleChange={(emoji) => {
                if (postingDisableFunction) return postingDisableFunction();

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
                if (postingDisableFunction) return postingDisableFunction();

                if (e.target.value.length > TITLE_LENGTH_MAXIMUM) {
                  return message.info(
                    "Vent titles can't have more than " +
                      TITLE_LENGTH_MAXIMUM +
                      " characters :("
                  );
                }

                setTitle(e.target.value);
                setSaving(false);
              }}
              placeholder="Our community is listening :)"
              type="text"
              value={title}
            />
            {title.length >= TITLE_LENGTH_MINIMUM && (
              <p className={title.length > TITLE_LENGTH_MAXIMUM ? "red" : ""}>
                {title.length}/{TITLE_LENGTH_MAXIMUM}
              </p>
            )}
          </Space>
        )}
        {!isMinified && (
          <Space className="x-fill" direction="vertical">
            <h5 className="fw-400">Tag this vent</h5>

            <input
              className="x-fill py8 px16 br4"
              onChange={(e) => {
                if (postingDisableFunction) return postingDisableFunction();

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
                  <Tag
                    key={tagHit.objectID}
                    postingDisableFunction={postingDisableFunction}
                    setTags={setTags}
                    tagHit={tagHit}
                    tags={tags}
                  />
                ))}
              </Container>
            )}
          </Space>
        )}
        {!isMinified && tags && tags.length > 0 && (
          <Container className="column gap8">
            <h5>Selected Tags</h5>
            <Container className="x-fill wrap gap8">
              {tags.map((tag, index) => (
                <SelectedTag
                  postingDisableFunction={postingDisableFunction}
                  index={index}
                  key={tag.objectID}
                  setTags={setTags}
                  tag={tag}
                  tags={tags}
                />
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
                  if (postingDisableFunction) return postingDisableFunction();

                  if (!description) {
                    return message.info("You need to enter a description :)");
                  } else if (!checkVentTitle(title)) {
                    return;
                  } else {
                    setTagText("");
                    setSaving(true);

                    import("./util").then((functions) => {
                      functions.saveVent(
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
                        isBirthdayPost,
                        tags,
                        {
                          description,
                          title,
                        },
                        ventID,
                        user
                      );
                    });
                  }
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
              <h1
                className={
                  "fs-18 no-bold grey-1 italic tac " +
                  (getIsMobileOrTablet() ? "flex-fill" : "container medium")
                }
              >
                {quote.value}
              </h1>
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

function Tag({ postingDisableFunction, setTags, tagHit, tags }) {
  return (
    <button
      className="button-10 br4 px8 py4"
      onClick={() => {
        if (postingDisableFunction) return postingDisableFunction();

        if (tags && tags.length >= 3) {
          return message.info("You can not set more than 3 tags in a vent!");
        }
        import("./util").then((functions) => {
          functions.updateTags(setTags, tagHit);
        });
      }}
    >
      {viewTagFunction(tagHit.objectID)}
    </button>
  );
}

function SelectedTag({ index, postingDisableFunction, setTags, tag, tags }) {
  return (
    <Container
      className="button-2 br4 gap8 pa8"
      onClick={() => {
        if (postingDisableFunction) return postingDisableFunction();

        let temp = [...tags];
        temp.splice(index, 1);
        setTags(temp);
      }}
    >
      <p className="ic flex-fill">{viewTagFunction(tag.objectID)}</p>

      <FontAwesomeIcon icon={faTimes} />
    </Container>
  );
}

export default NewVentComponent;
