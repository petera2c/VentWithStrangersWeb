import React, { Component } from "react";

import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";

import { Link } from "react-router-dom";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import { getTextFromHtmlTag, isMobileOrTablet } from "../../util";
import { createBlogDivs, createContentImagesArray } from "./util";

class ViewWebsiteBlog extends Component {
  findFirstImage = images => {
    let location = images[0].location;
    let indexOfSmallestLocation = 0;
    for (let index in images) {
      if (images[index].location < location) indexOfSmallestLocation = index;
    }
    return indexOfSmallestLocation;
  };
  render() {
    const {
      authorID,
      contentArray = [],
      featuredBlogs = [],
      images = [],
      id
    } = this.props;

    const contentImagesArray = createContentImagesArray(contentArray, images);
    const divs = createBlogDivs(authorID, contentImagesArray);

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
        className="website-page align-center mt64 mb32"
        title={metaTitle ? metaTitle : "Blog Post"}
        description={
          metaDescription
            ? metaDescription
            : "What are you waiting for? Get reading!"
        }
        keywords="ghostit, blog"
      >
        <Container>
          <Container
            className={`blog block ${
              isMobileOrTablet() ? "x-fill px16" : "container-box large"
            }`}
          >
            {divs}
          </Container>
          {!isMobileOrTablet() && (
            <Container
              className="column ml64 x-300px"
              style={{ marginTop: "74px" }}
            >
              <Text className="fs-26 mb16" text="Featured Blogs" type="h4" />
              {featuredBlogs.map((ghostitBlog, index) => {
                const { contentArray, createdAt } = ghostitBlog;
                const ghostitBlogDate = new moment(createdAt);

                if (ghostitBlog._id === id) return undefined;

                let temp = document.createElement("div");
                if (contentArray[1])
                  temp.innerHTML =
                    "<div   dangerouslySetInnerHTML={{__html: " +
                    contentArray[1].html +
                    "";

                const metaDescription =
                  temp.textContent || temp.innerText || "";

                return (
                  <Link
                    className="x-fill column common-border one-blue bg-white shadow-3 button relative mb32 br16"
                    key={index}
                    to={ghostitBlog.url}
                  >
                    <Container className="column pa32">
                      <Container
                        className="image-cover x-fill relative br8"
                        style={
                          ghostitBlog.images[0]
                            ? {
                                backgroundImage:
                                  "url(" +
                                  ghostitBlog.images[
                                    this.findFirstImage(ghostitBlog.images)
                                  ].url +
                                  ")"
                              }
                            : {}
                        }
                      >
                        <Container
                          className="absolute top-0 left-0 bg-white full-center shadow-4 px16 py8"
                          style={{ borderBottomRightRadius: "4px" }}
                        >
                          <Text
                            className="quicksand four-blue mr8"
                            text={ghostitBlogDate.format("DD")}
                            type="h4"
                          />
                          <Text
                            className="bold"
                            text={`${ghostitBlogDate
                              .format("MMMM")
                              .substring(0, 3)}, ${ghostitBlogDate.year()}`}
                            type="p"
                          />
                        </Container>
                      </Container>
                      {ghostitBlog.contentArray[0] && (
                        <Container className="column pt16">
                          <Text
                            className="muli"
                            text={getTextFromHtmlTag(
                              ghostitBlog.contentArray[0].html
                            )}
                            type="h4"
                          />
                          {ghostitBlog.contentArray[1] && (
                            <Text
                              className="pt8"
                              text={
                                getTextFromHtmlTag(
                                  ghostitBlog.contentArray[1].html
                                ).substring(0, 100) + "..."
                              }
                              type="p"
                            />
                          )}
                        </Container>
                      )}
                    </Container>
                    <Container className="absolute bottom--16 left-0 right-0 round-icon common-border four-blue margin-hc round bg-white shadow-blue-2 full-center">
                      <FontAwesomeIcon icon={faAngleRight} />
                    </Container>
                  </Link>
                );
              })}
            </Container>
          )}
        </Container>
      </Page>
    );
  }
}

export default ViewWebsiteBlog;
