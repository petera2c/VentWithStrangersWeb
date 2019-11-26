import React, { Component, useState } from "react";
import Picker from "emoji-picker-react";

import TextArea from "react-textarea-autosize";

import Page from "../../components/containers/Page";
import VWSContainer from "../../components/containers/VWSContainer";

import VWSText from "../../components/views/VWSText";
import VWSButton from "../../components/views/VWSButton";
import VWSInput from "../../components/views/VWSInput";

import Emoji from "../../components/Emoji";

import Consumer from "../../context";

import { saveProblem, updateTags } from "./util";

class NewProblemPage extends Component {
  state = {
    description: "",
    tags: "",
    title: ""
  };
  handleChange = stateObject => {
    this.setState(stateObject);
  };
  render() {
    const { description, tags, title } = this.state;

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
              <VWSText className="mb16" text="Post Your Problem" type="h4" />

              <VWSContainer className="column bg-white py32 px32 br4">
                <VWSText text="Title" type="h6" />

                <VWSInput
                  className="py8 px16 mb8 br4"
                  onChange={e => this.handleChange({ title: e.target.value })}
                  placeholder="Sed malesuada sagittis risus, id pharetra est scelerisque sed"
                  type="text"
                  value={title}
                />
                <VWSContainer className="column relative mb8">
                  <VWSText text="Tag this problem" type="h6" />

                  <VWSInput
                    className="py8 px16 br4"
                    id="tags-input"
                    onChange={e => {
                      updateTags(e.target.value, context.socket);
                      this.handleChange({ tags: e.target.value });
                    }}
                    placeholder="Depression, Relationship, Bullying"
                    type="text"
                    value={tags}
                  />
                  {document.activeElement ===
                    document.getElementById("tags-input") && (
                    <VWSContainer className="absolute top-100 x-fill bg-white shadow-1 pa8 br8">
                      hello world
                    </VWSContainer>
                  )}
                </VWSContainer>
                <VWSContainer>
                  <VWSContainer className="column pa8 mx8">
                    <VWSContainer className="">
                      <VWSText className="pa8 mx8" text="Female" type="h6" />
                      <VWSText className="pa8 mx8" text="Male" type="h6" />
                    </VWSContainer>

                    <VWSText text="Gender" type="h6" />
                  </VWSContainer>

                  <VWSContainer className="column pa8 mx8">
                    <VWSInput
                      className="py8 px16 br4"
                      id="tags-input"
                      onChange={e => {
                        this.handleChange({ age: e.target.value });
                      }}
                      placeholder="Depression, Relationship, Bullying"
                      type="text"
                      value={23}
                    />
                    <VWSText text="Age" type="h6" />
                  </VWSContainer>
                </VWSContainer>
                <VWSText text="Description" type="h6" />
                <TextArea
                  className="py8 px16 mb8 br4"
                  onChange={event =>
                    this.handleChange({ description: event.target.value })
                  }
                  placeholder="Aliquam semper vel mi eu sodales. Quisque nec massa eget elit placerat fermentum eu quis eros. Cras at felis nec arcu maximus congue ut a lectus. Fusce luctus dolor ac dolor vestibulum, eu lobortis nibh finibus. Morbi est risus, interdum non molestie vel, consectetur nec velit. Donec posuere ex et nibh lobortis, et fermentum sapien laoreet. Vestibulum in tincidunt purus, aliquet vestibulum turpis. Nunc dapibus erat in risus posuere, vitae tempus enim vulputate. Maecenas quis pellentesque augue. Fusce non vestibulum arcu."
                  style={{ minHeight: "300px" }}
                  value={description}
                />
                <VWSContainer>
                  <Emoji />

                  <VWSButton
                    className="bg-blue white py8 mb8 br4"
                    onClick={() =>
                      saveProblem(
                        () => {
                          const { history } = this.props;
                          history.push("/problems/" + title);

                          window.location.reload();
                        },
                        { description, title }
                      )
                    }
                    text="Submit"
                  />
                </VWSContainer>
                <VWSText
                  className="x-fill"
                  style={{ whiteSpace: "normal" }}
                  text="If you or someone you know  is in danger, call your local emergency services or police. National Suicide Prevention Lifeline (1-800-273-TALK [8255])."
                  type="p"
                />
              </VWSContainer>
            </VWSContainer>
          </Page>
        )}
      </Consumer>
    );
  }
}

export default NewProblemPage;
