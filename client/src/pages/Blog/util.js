import React from "react";
import { Link } from "react-router-dom";

import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

export const createLinkFromNameAndJob = (id, name, title) => {
  return (
    "/team-member/" +
    (title.replace(/[^a-zA-Z ]/g, "") + "/" + name.replace(/[^a-zA-Z ]/g, ""))
      .replace(/ /g, "-")
      .toLowerCase() +
    "/" +
    id
  );
};

export const createBlogDivs = contentImagesArray => {
  const blogDivs = [];
  for (let index = 0; index < contentImagesArray.length; index++) {
    const contentOrImage = contentImagesArray[index];
    if (!contentOrImage) continue;
    if (!contentOrImage.html) {
      if (contentOrImage.size === "small") {
        blogDivs.push(createSmallDiv(contentImagesArray, index));
        index += 1;
      } else {
        blogDivs.push(createRelevantImageDiv(contentImagesArray[index], index));
      }
    } else {
      blogDivs.push(
        <div
          className="mb8"
          dangerouslySetInnerHTML={{ __html: contentOrImage.html }}
          key={index}
        />
      );
    }
  }
  return blogDivs;
};

export const createContentImagesArray = (contentArray, images) => {
  const contentImagesArray = [];

  for (let index in images) {
    const image = images[index];
    if (!image) continue;
    contentImagesArray[image.location] = image;
  }
  for (let index in contentArray) {
    const content = contentArray[index];
    if (!content) continue;
    contentImagesArray[content.location] = content;
  }

  return contentImagesArray;
};

const createRelevantImageDiv = (image, index) => {
  return (
    <img
      alt="Blog"
      className={
        "float-left ov-hidden image mb8 br8 " +
        image.size +
        (image.size === "medium" ? "" : " mr16")
      }
      key={index + "image"}
      src={image.file || image.url}
    />
  );
};

const createSmallDiv = (contentImagesArray, index) => {
  const imageDiv = createRelevantImageDiv(contentImagesArray[index], index);
  let text;
  if (
    contentImagesArray[Number(index) + 1] &&
    contentImagesArray[Number(index) + 1].html
  )
    text = (
      <div
        className="mb8"
        key={index}
        dangerouslySetInnerHTML={{
          __html: contentImagesArray[Number(index) + 1].html
        }}
      />
    );
  return (
    <Container key={index}>
      <Container className="block container-box large">
        {imageDiv}
        {text}
      </Container>
    </Container>
  );
};
