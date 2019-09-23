import React, { Component } from "react";

import TextArea from "react-textarea-autosize";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

import GIText from "../../components/views/GIText";
import GIButton from "../../components/views/GIButton";
import GIInput from "../../components/views/GIInput";
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
            className="column align-center py32"
            description="Problem"
            keywords=""
            title="Problem"
          >
            <GIContainer className="column x-50 bg-white py32 px64 br16">
              <GIText className="tac mb16" text="Post Your Problem" type="h4" />
              <GIInput
                className="py8 px16 mb8 br4"
                onChange={e => this.handleChange({ title: e.target.value })}
                placeholder="Title"
                type="text"
                value={title}
              />
              <GIContainer className="relative mb8">
                <GIInput
                  className="py8 px16 br4"
                  id="tags-input"
                  onChange={e => {
                    updateTags(e.target.value, context.socket);
                    this.handleChange({ tags: e.target.value });
                  }}
                  placeholder='Tag this problem ex: "PTSD, depression, relationship". (Separate by comma)'
                  type="text"
                  value={tags}
                />
                {document.activeElement ===
                  document.getElementById("tags-input") && (
                  <GIContainer className="absolute top-100 x-fill bg-white shadow-1 pa8 br8">
                    hello world
                  </GIContainer>
                )}
              </GIContainer>
              <TextArea
                className="py8 px16 mb8 br4"
                onChange={event =>
                  this.handleChange({ description: event.target.value })
                }
                placeholder="Description"
                style={{ minHeight: "300px" }}
                value={description}
              />
              <GIButton
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
            </GIContainer>
          </Page>
        )}
      </Consumer>
    );
  }
}

export default NewProblemPage;
