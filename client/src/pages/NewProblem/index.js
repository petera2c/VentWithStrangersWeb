import React, { Component, useState } from "react";

import TextArea from "react-textarea-autosize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars } from "@fortawesome/free-solid-svg-icons/faMars";
import { faVenus } from "@fortawesome/free-solid-svg-icons/faVenus";
import { faGenderless } from "@fortawesome/free-solid-svg-icons/faGenderless";

import Page from "../../components/containers/Page";
import VWSContainer from "../../components/containers/VWSContainer";

import VWSText from "../../components/views/VWSText";
import VWSButton from "../../components/views/VWSButton";
import VWSInput from "../../components/views/VWSInput";

import Emoji from "../../components/Emoji";

import Consumer, { ExtraContext } from "../../context";

import { saveProblem, updateTags } from "./util";

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
            className="column align-center bg-grey py32"
            description="Problem"
            keywords=""
            title="Problem"
          >
            <VWSContainer className="container-box large ov-visible column">
              <VWSText
                className="fw-600 mb16"
                text="Post Your Problem"
                type="h4"
              />

              <VWSContainer className="column bg-white">
                <VWSContainer className="column py32 px32 br4">
                  <VWSText className="mb8" text="Title" type="h5" />

                  <VWSInput
                    className="py8 px16 mb8 br4"
                    onChange={e => this.handleChange({ title: e.target.value })}
                    placeholder="Sed malesuada sagittis risus, id pharetra est scelerisque sed"
                    type="text"
                    value={title}
                  />
                  <VWSContainer className="column relative mb8">
                    <VWSText
                      className="mb8"
                      text="Tag this problem"
                      type="h5"
                    />

                    <VWSInput
                      className="py8 px16 br4"
                      onChange={e => {
                        //updateTags(e.target.value, context.socket);
                        this.handleChange({ tags: e.target.value });
                      }}
                      placeholder="Depression, Relationship, Bullying"
                      type="text"
                      value={tags}
                    />
                  </VWSContainer>
                  <VWSContainer>
                    <VWSContainer className="fill-flex column mb8">
                      <VWSText className="mb8" text="Gender" type="h5" />
                      <VWSContainer className="fill-flex">
                        <VWSText
                          className={`tac fill-flex clickable border-all large ${
                            gender === 0 ? "active blue" : ""
                          } pa8`}
                          onClick={() => this.handleChange({ gender: 0 })}
                          style={{
                            borderTopLeftRadius: "4px",
                            borderBottomLeftRadius: "4px",
                            borderRight: gender === 0 ? "" : "none"
                          }}
                          type="h5"
                        >
                          <FontAwesomeIcon
                            className="mr8"
                            icon={faGenderless}
                          />
                          Everyone
                        </VWSText>
                        <VWSText
                          className={`tac fill-flex clickable border-all large ${
                            gender === 1 ? "active blue" : ""
                          } pa8`}
                          onClick={() => this.handleChange({ gender: 1 })}
                          style={{
                            borderLeft: gender === 0 ? "none" : "",
                            borderRight: gender === 2 ? "none" : ""
                          }}
                          type="h5"
                        >
                          <FontAwesomeIcon className="mr8" icon={faVenus} />
                          Female
                        </VWSText>
                        <VWSText
                          className={`tac fill-flex clickable border-all large ${
                            gender === 2 ? "active blue" : ""
                          } pa8`}
                          onClick={() => this.handleChange({ gender: 2 })}
                          style={{
                            borderBottomRightRadius: "4px",
                            borderTopRightRadius: "4px",
                            borderLeft: gender === 2 ? "" : "none"
                          }}
                          type="h5"
                        >
                          <FontAwesomeIcon className="mr8" icon={faMars} />
                          Male
                        </VWSText>
                      </VWSContainer>
                    </VWSContainer>
                  </VWSContainer>
                  <VWSText className="mb8" text="Description" type="h5" />
                  <TextArea
                    className="no-border py8 px16 mb8 br4"
                    onChange={event =>
                      this.handleChange({ description: event.target.value })
                    }
                    placeholder="Aliquam semper vel mi eu sodales. Quisque nec massa eget elit placerat fermentum eu quis eros. Cras at felis nec arcu maximus congue ut a lectus. Fusce luctus dolor ac dolor vestibulum, eu lobortis nibh finibus. Morbi est risus, interdum non molestie vel, consectetur nec velit. Donec posuere ex et nibh lobortis, et fermentum sapien laoreet. Vestibulum in tincidunt purus, aliquet vestibulum turpis. Nunc dapibus erat in risus posuere, vitae tempus enim vulputate. Maecenas quis pellentesque augue. Fusce non vestibulum arcu."
                    value={description}
                  />
                  <VWSContainer className="justify-end">
                    <Emoji
                      handleChange={emoji => {
                        this.handleChange({
                          description: this.state.description + emoji
                        });
                      }}
                    />

                    {!saving && (
                      <VWSButton
                        className="bg-blue white px64 py8 mb8 br4"
                        onClick={() => {
                          if (description && tags && title) {
                            this.handleChange({ saving: true });
                            saveProblem(
                              () => {
                                this.handleChange({ saving: false });
                                const { history } = this.props;
                                history.push("/problems/" + title);

                                window.location.reload();
                              },
                              { description, gender, tags, title }
                            );
                          } else alert("One or more fields is missing.");
                        }}
                        text="Submit"
                      />
                    )}
                  </VWSContainer>
                </VWSContainer>
                <VWSContainer
                  className="column pa32"
                  style={{ borderTop: "2px solid var(--grey-color-2)" }}
                >
                  <VWSText
                    text="If you or someone you know  is in danger, call your local emergency services or police."
                    type="p"
                  />
                  <VWSText
                    text="National Suicide Prevention Lifeline (1-800-273-TALK [8255])."
                    type="p"
                  />
                </VWSContainer>
              </VWSContainer>
            </VWSContainer>
          </Page>
        )}
      </Consumer>
    );
  }
}
NewProblemPage.contextType = ExtraContext;

export default NewProblemPage;
