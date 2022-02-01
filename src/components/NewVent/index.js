import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loadable from "@loadable/component";
import TextArea from "react-textarea-autosize";
import algoliasearch from "algoliasearch";
import { message, Space, Tooltip } from "antd";

import { faQuestionCircle } from "@fortawesome/pro-duotone-svg-icons/faQuestionCircle";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserContext } from "../../context";

const Container = loadable(() => import("../containers/Container"));
const Emoji = loadable(() => import("../Emoji"));
const HandleOutsideClick = loadable(() =>
  import("../containers/HandleOutsideClick")
);
const MakeAvatar = loadable(() => import("../MakeAvatar"));
const StarterModal = loadable(() => import("../modals/Starter"));

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

  const [canUserPost, setCanUserPost] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [quoteDisplayName, setQuoteDisplayName] = useState("Anonymous");

  useEffect(() => {
    isMounted.current = true;
    import("../../util").then((functions) => {
      setIsMobileOrTablet(functions.getIsMobileOrTablet());
      if (quote && quote.displayName)
        setQuoteDisplayName(functions.capitolizeFirstChar(quote.displayName));
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

    import("./util").then((functions) => {
      if (ventID) functions.getVent(setDescription, setTags, setTitle, ventID);

      functions.getQuote(isMounted, setQuote);
      setPlaceholderText(functions.selectEncouragingMessage());

      if (user)
        functions.getUserVentTimeOut((res) => {
          if (res) {
            import("../../util").then((functions) => {
              functions.countdown(
                isMounted,
                res,
                setUserVentTimeOut,
                setUserVentTimeOutFormatted
              );
              setInterval(
                () =>
                  functions.countdown(
                    isMounted,
                    res,
                    setUserVentTimeOut,
                    setUserVentTimeOutFormatted
                  ),
                1000
              );
            });
          }
        }, user.uid);
    });

    import("../../util").then((functions) => {
      setCanUserPost(functions.canUserPost(userBasicInfo));
    });

    return () => {
      isMounted.current = false;
    };
  }, [isMounted, user, ventID]);

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
              <p className="button-8 tac lh-1">- {quoteDisplayName}</p>
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
            onChange={async (event) => {
              if (
                !(await import("./util").then((functions) => {
                  return functions.checks(
                    canUserPost,
                    setStarterModal,
                    user,
                    userBasicInfo,
                    ventID,
                    userVentTimeOut
                  );
                }))
              )
                return;

              setDescription(event.target.value);
            }}
            onClick={() => setIsMinified(false)}
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
          {!isMobileOrTablet && (
            <Emoji
              handleChange={async (emoji) => {
                if (
                  !(await import("./util").then((functions) => {
                    return functions.checks(
                      canUserPost,
                      setStarterModal,
                      user,
                      userBasicInfo,
                      ventID,
                      userVentTimeOut
                    );
                  }))
                )
                  return;

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
              onChange={async (e) => {
                if (
                  !(await import("./util").then((functions) => {
                    return functions.checks(
                      canUserPost,
                      setStarterModal,
                      user,
                      userBasicInfo,
                      ventID,
                      userVentTimeOut
                    );
                  }))
                )
                  return;

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
              onChange={async (e) => {
                if (
                  !(await import("./util").then((functions) => {
                    return functions.checks(
                      canUserPost,
                      setStarterModal,
                      user,
                      userBasicInfo,
                      ventID,
                      userVentTimeOut
                    );
                  }))
                )
                  return;

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
                    canUserPost={canUserPost}
                    key={tagHit.objectID}
                    setStarterModal={setStarterModal}
                    setTags={setTags}
                    tagHit={tagHit}
                    tags={tags}
                    user={user}
                    userBasicInfo={userBasicInfo}
                    userVentTimeOut={userVentTimeOut}
                    ventID={ventID}
                  />
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
                <SelectedTag
                  canUserPost={canUserPost}
                  index={index}
                  key={tag.objectID}
                  setStarterModal={setStarterModal}
                  setTags={setTags}
                  tag={tag}
                  tags={tags}
                  user={user}
                  userBasicInfo={userBasicInfo}
                  userVentTimeOut={userVentTimeOut}
                  ventID={ventID}
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
                onClick={async () => {
                  if (
                    !(await import("./util").then((functions) => {
                      return functions.checks(
                        canUserPost,
                        setStarterModal,
                        user,
                        userBasicInfo,
                        ventID,
                        userVentTimeOut
                      );
                    }))
                  )
                    return;

                  if (description && title) {
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
                <p className="blue tac lh-1">- {quoteDisplayName}</p>
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

function Tag({
  canUserPost,
  setStarterModal,
  setTags,
  tagHit,
  tags,
  user,
  userBasicInfo,
  userVentTimeOut,
  ventID,
}) {
  const [viewTag, setViewTag] = useState("");

  useEffect(() => {
    import("../../util").then((functions) => {
      setViewTag(functions.viewTag(tagHit.objectID));
    });
  }, []);

  return (
    <button
      className="button-10 br4 px8 py4"
      onClick={async () => {
        const test = await import("./util").then(async (functions) => {
          const something = await functions.checks(
            canUserPost,
            setStarterModal,
            user,
            userBasicInfo,
            ventID,
            userVentTimeOut
          );

          return something;
        });

        if (!test) {
          return;
        }

        if (tags && tags.length >= 3) {
          return message.info("You can not set more than 3 tags in a vent!");
        }
        import("./util").then((functions) => {
          functions.updateTags(setTags, tagHit);
        });
      }}
    >
      {viewTag}
    </button>
  );
}

function SelectedTag({
  canUserPost,
  index,
  setStarterModal,
  setTags,
  tag,
  tags,
  user,
  userBasicInfo,
  userVentTimeOut,
  ventID,
}) {
  const [viewTag, setViewTag] = useState("");

  useEffect(() => {
    import("../../util").then((functions) => {
      setViewTag(functions.viewTag(tag.objectID));
    });
  }, []);

  return (
    <Container
      className="button-2 br4 gap8 pa8"
      onClick={async () => {
        if (
          !(await import("./util").then((functions) => {
            return functions.checks(
              canUserPost,
              setStarterModal,
              user,
              userBasicInfo,
              ventID,
              userVentTimeOut
            );
          }))
        )
          return;

        let temp = [...tags];
        temp.splice(index, 1);
        setTags(temp);
      }}
    >
      <p className="ic flex-fill">{viewTag}</p>

      <FontAwesomeIcon icon={faTimes} />
    </Container>
  );
}

export default NewVentComponent;
