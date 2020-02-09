import React, { Component } from "react";
import Consumer, { ExtraContext } from "../../context";

import TextArea from "react-textarea-autosize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars } from "@fortawesome/free-solid-svg-icons/faMars";
import { faVenus } from "@fortawesome/free-solid-svg-icons/faVenus";
import { faGenderless } from "@fortawesome/free-solid-svg-icons/faGenderless";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";

import Text from "../../components/views/Text";
import Button from "../../components/views/Button";
import Input from "../../components/views/Input";

import Emoji from "../../components/Emoji";

import { saveProblem } from "./util";
import { isMobileOrTablet } from "../../util";

class NewProblemPage extends Component {
  state = {
    description: "",
    gender: 0,
    tags: "",
    title: "",
    saving: false
  };
  handleChange = stateObject => {
    this.setState(stateObject);
  };
  render() {
    const { description, gender, saving, tags, title } = this.state;

    return (
      <Consumer>
        {context => (
          <Page
            className="column align-center bg-grey-2"
            description="You aren’t alone, and you should never feel alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you."
            keywords=""
            title="Post a Problem"
          >
            <Container className="x-fill justify-center align-start">
              <Text
                className={
                  "fw-400 fs-20 " +
                  (isMobileOrTablet()
                    ? "container mobile-full pa16"
                    : "container extra-large pr32 pb32")
                }
                text="People care and help is here. Vent and chat anonymously to be a part of a community committed to making the world a better place. This is a website for people that want to be heard and people that want to listen."
                type="h2"
              />
            </Container>
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
                text="Post Your Problem"
                type="h4"
              />

              <Container className="column bg-white shadow-3 br8">
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
                      text="Tag this problem"
                      type="h5"
                    />

                    <Input
                      className="py8 px16 br4"
                      onChange={e => {
                        this.handleChange({
                          saving: false,
                          tags: e.target.value
                        });
                      }}
                      placeholder="Depression, Relationship, Bullying"
                      type="text"
                      value={tags}
                    />
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
                            tags,
                            title
                          } = this.state;

                          if (description && title) {
                            this.handleChange({ saving: true });

                            const tagsArray = [];
                            let word = "";

                            for (let index in tags) {
                              if (tags[index] === "," || tags[index] === " ") {
                                if (word !== "") {
                                  tagsArray.push(word);
                                  word = "";
                                }
                              } else word += tags[index];
                            }
                            if (word) tagsArray.push(word);
                            saveProblem(
                              problem => {
                                this.handleChange({ saving: false });
                                const { history } = this.props;
                                history.push(
                                  "/problem/" +
                                    problem._id +
                                    "/" +
                                    problem.title
                                      .replace(/[^a-zA-Z ]/g, "")
                                      .replace(/ /g, "-")
                                      .toLowerCase()
                                );

                                window.location.reload();
                              },
                              { description, gender, tags: tagsArray, title },
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
                  <Text
                    text="National Suicide Prevention Lifeline (1-800-273-TALK [8255])."
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
NewProblemPage.contextType = ExtraContext;

export default NewProblemPage;
