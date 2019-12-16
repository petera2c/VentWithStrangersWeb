import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

import Container from "../../../components/containers/Container";
import Text from "../../../components/views/Text";
import Input from "../../../components/views/Input";
import Button from "../../../components/views/Button";

import Consumer, { ExtraContext } from "../../../context";
//https://www.youtube.com/trending?search_query=test
const recentTags = [
  { name: "hello" },
  { name: "hello" },
  { name: "hello" },
  { name: "hello" },
  { name: "hello" }
];

class TagsModal extends Component {
  state = {
    searchString: "",
    selectedTags: [{ id: 435, name: "test1" }, { id: 435, name: "test" }]
  };
  componentDidMount() {
    this.ismounted = true;
  }
  componentWillUnmount() {
    this.ismounted = false;
  }
  handleChange = stateObj => {
    if (this.ismounted) this.setState(stateObj);
  };
  addSelectedTag = index => {
    let { selectedTags } = this.state;

    if (selectedTags.find(tag => tag.id === recentTags[index].id))
      this.context.notify({
        message: "You already have this tag selected!",
        type: "danger"
      });
    else if (selectedTags.length >= 2)
      this.context.notify({
        message: "You can not have more than two tags!",
        type: "danger"
      });
    else {
      selectedTags.push(recentTags[index]);
      this.handleChange({ selectedTags });
    }
  };
  removeSelectedTag = index => {
    let { selectedTags } = this.state;

    selectedTags.splice(index, 1);
    this.handleChange({ selectedTags });
  };
  searchTags = tag => {
    const { socket } = this.context;
    this.handleChange({ searchString: event.target.value });
    socket.emit("search_tags", tag);
  };

  render() {
    const { searchString, selectedTags } = this.state;
    const { close } = this.props;

    return (
      <Container className="modal-container">
        <Container className="modal container medium column bg-white br4">
          <Container className="x-fill full-center bg-grey-10 pa16">
            <Text className="fw-400 grey-8" text="Tags Filters" type="h4" />
          </Container>
          <Container className="x-fill column border-bottom large px32 py16">
            <Container className="justify-between align-center border-bottom mb16">
              <Container className="fill-flex align-center">
                <FontAwesomeIcon icon={faSearch} />
                <Input
                  className="fill-flex no-border py8 px16 br4"
                  onChange={event => this.searchTags(event.target.value)}
                  type="text"
                  placeholder="Search"
                  required
                  value={searchString}
                />
              </Container>
              <Button
                className="blue"
                onClick={() =>
                  this.handleChange({ searchString: "", selectedTags: [] })
                }
                text="Reset Tags"
              />
            </Container>
            <Text className="grey-8 mb8" text="Recent Tags" type="h6" />
            <Container className="x-fill grid-1 mb8">
              {recentTags.map((tag, index) => (
                <Button
                  className="grey-1 tac fw-300 border-all px16 py8 br4"
                  key={index}
                  onClick={() => this.addSelectedTag(index)}
                  text={tag.name}
                />
              ))}
            </Container>
            {selectedTags.length > 0 && (
              <Text
                className="border-bottom grey-8 py8 mb16"
                text="Selected Tags"
                type="h6"
              />
            )}
            {selectedTags.length > 0 && (
              <Container className="x-fill grid-2">
                {selectedTags.map((tag, index) => (
                  <Container
                    key={index}
                    className="clickable"
                    onClick={() => this.removeSelectedTag(index)}
                  >
                    <Text
                      className="fill-flex tac fw-300 border-all blue active large px16 py8"
                      style={{
                        marginRight: "1px",
                        borderTopLeftRadius: "4px",
                        borderBottomLeftRadius: "4px"
                      }}
                      text={tag.name}
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
            )}
          </Container>
          <Container className="full-center py16">
            <Button
              className="grey-1 border-all px32 py8 mr16 br4"
              text="Cancel"
              onClick={close}
            />
            <Button
              className="white bg-blue px32 py8 br4"
              text="Apply"
              onClick={() => {
                const { browser, history, location } = this.props;
                let searchPathname = location.pathname;

                for (let index in selectedTags) {
                  if (index == 0)
                    searchPathname += "?" + selectedTags[index].name;
                  else searchPathname += "+" + selectedTags[index].name;
                }

                history.push(searchPathname);
                //close();
              }}
            />
          </Container>
        </Container>
        <Container className="modal-background" onClick={close} />
      </Container>
    );
  }
}

TagsModal.contextType = ExtraContext;

export default withRouter(TagsModal);
