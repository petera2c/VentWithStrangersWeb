import React, { Component } from "react";

import axios from "axios";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";

import { Link, withRouter } from "react-router-dom";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import { getTextFromHtmlTag, isMobileOrTablet } from "../../util";
import { createBlogDivs, createContentImagesArray } from "./util";

const getVentIdFromURL = pathname => {
  // regular expression will not work due to catastrophic backtracing
  //pathname.match(/(?<=\/problem\/\s*).*?(?=\s*\/)/gs);
  if (pathname) {
    const ventIdStart = pathname.slice(6, pathname.length);
    let ventID = "";
    for (let index in ventIdStart) {
      if (ventIdStart[index] === "/") break;
      ventID += ventIdStart[index];
    }

    return ventID;
  }
};

class ViewWebsiteBlog extends Component {
  state = {
    contentArray: [],
    id: undefined,
    images: []
  };
  componentDidMount() {
    this._ismounted = true;
    const { location } = this.props;
    const { pathname } = location;

    const regexMatch = getVentIdFromURL(pathname);
    let id;
    if (regexMatch) id = regexMatch;

    if (id) {
      axios.get("/api/blog/" + id).then(results => {
        const { blog, success } = results.data;

        if (blog && success)
          if (this._ismounted)
            this.setState({
              contentArray: blog.contentArray,
              id: blog._id,
              images: blog.images
            });
      });
    }
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  findFirstImage = images => {
    let location = images[0].location;
    let indexOfSmallestLocation = 0;
    for (let index in images) {
      if (images[index].location < location) indexOfSmallestLocation = index;
    }
    return indexOfSmallestLocation;
  };
  render() {
    const { contentArray = [], images = [], id } = this.state;

    const contentImagesArray = createContentImagesArray(contentArray, images);
    const divs = createBlogDivs(contentImagesArray);

    let metaTitle = "";
    let temp = document.createElement("div");
    if (contentArray[0])
      temp.innerHTML =
        "<div   dangerouslySetInnerHTML={{__html: " + contentArray[0].html + "";

    metaTitle = temp.textContent || temp.innerText || "";

    let metaDescription = "";
    let temp2 = document.createElement("div");
    if (contentArray[1])
      temp2.innerHTML =
        "<div   dangerouslySetInnerHTML={{__html: " + contentArray[1].html + "";

    metaDescription = temp2.textContent || temp2.innerText || "";
    return (
      <Page
        className="align-center bg-grey-2 pt32 pb32"
        title={metaTitle ? metaTitle : "Blog Post"}
        description={
          metaDescription
            ? metaDescription
            : "What are you waiting for? Get reading!"
        }
      >
        <Container className="bg-white pa32 br16">
          <Container
            className={`blog block ${
              isMobileOrTablet() ? "x-fill px16" : "container large"
            }`}
          >
            {divs}
          </Container>
        </Container>
      </Page>
    );
  }
}

export default withRouter(ViewWebsiteBlog);
