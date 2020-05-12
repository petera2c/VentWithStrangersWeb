import React, { Component } from "react";
import Consumer, { ExtraContext } from "../../context";

import TextArea from "react-textarea-autosize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";

import Text from "../../components/views/Text";
import Button from "../../components/views/Button";
import Input from "../../components/views/Input";

import Emoji from "../../components/Emoji";

import { saveVent } from "./util";
import { isMobileOrTablet } from "../../util";

class NewVentPage extends Component {
  state = {
    description: "",
    gender: 0,
    tags: [],
    tagText: "",
    title: "",
    saving: false
  };
  handleChange = stateObject => {
    this.setState(stateObject);
  };
  updateTags = inputText => {
    let { tags } = this.state;

    let word = "";
    for (let index in inputText) {
      if (inputText[index] === " " || inputText[index] === ",") {
        if (word) tags.push(word);
        word = "";
      } else word += inputText[index];
    }
    this.handleChange({ saving: false, tags, tagText: word });
  };
  removeTag = index => {
    let { tags } = this.state;

    tags.splice(index, 1);

    this.handleChange({ tags });
  };
  render() {
    const { description, gender, saving, tags, tagText, title } = this.state;

    return (
      <Consumer>
        {context => (
          <Page
            className="column align-center bg-grey-2"
            description="You aren’t alone, and you should never feel alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you."
            keywords=""
            title="Post a Vent"
          >
            <Container
              className={
                "ov-visible column py32 " +
                (isMobileOrTablet()
                  ? "container mobile-full px16"
                  : "container large")
              }
            >
              <Text className="fw-600 mb16" text="Post Your Vent" type="h4" />

              <Container className="column bg-white border-all2 br8">
                <Container className="column py32 px32 br4">
                  <Text className="fw-400 mb8" text="Title" type="h5" />

                  <Input
                    className="py8 px16 mb8 br4"
                    onChange={e =>
                      this.handleChange({
                        saving: false,
                        title: e.target.value
                      })
                    }
                    placeholder="We are here for you."
                    type="text"
                    value={title}
                  />
                  <Container className="column relative mb8">
                    <Text
                      className="fw-400 mb8"
                      text="Tag this vent"
                      type="h5"
                    />

                    <Input
                      className="py8 px16 br4"
                      onChange={e => this.updateTags(e.target.value)}
                      placeholder="depression, relationships, covid-19"
                      type="text"
                      value={tagText}
                    />
                  </Container>
                  <Container>
                    {tags.map((tag, index) => (
                      <Container
                        key={index}
                        className="clickable mr8 mb8"
                        onClick={() => this.removeTag(index)}
                      >
                        <Text
                          className="flex-fill tac fw-300 border-all blue active large px16 py8"
                          style={{
                            marginRight: "1px",
                            borderTopLeftRadius: "4px",
                            borderBottomLeftRadius: "4px"
                          }}
                          text={tag}
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
                    ))}
                  </Container>

                  <Text className="fw-400 mb8" text="Description" type="h5" />
                  <TextArea
                    className="py8 px16 mb8 br4"
                    onChange={event =>
                      this.handleChange({
                        saving: false,
                        description: event.target.value
                      })
                    }
                    placeholder="Let it all out. You are not alone."
                    style={{ minHeight: "100px" }}
                    value={description}
                  />
                  <Container className="justify-end">
                    <Emoji
                      handleChange={emoji => {
                        this.handleChange({
                          description: this.state.description + emoji
                        });
                      }}
                    />

                    {!saving && (
                      <Button
                        className="bg-blue white px64 py8 mb8 br4"
                        onClick={() => {
                          const {
                            description,
                            gender,
                            tags = [],
                            tagText,
                            title
                          } = this.state;
                          if (tagText) tags.push(tagText);
                          if (description && title) {
                            this.handleChange({ saving: true });

                            saveVent(
                              vent => {
                                this.handleChange({ saving: false });
                                const { history } = this.props;
                                history.push(
                                  "/problem/" +
                                    vent._id +
                                    "/" +
                                    vent.title
                                      .replace(/[^a-zA-Z ]/g, "")
                                      .replace(/ /g, "-")
                                      .toLowerCase()
                                );

                                window.location.reload();
                              },
                              { description, gender, tags, title },
                              context.notify
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
          </Page>
        )}
      </Consumer>
    );
  }
}
NewVentPage.contextType = ExtraContext;

export default NewVentPage;
