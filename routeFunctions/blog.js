const cloudinary = require("cloudinary");
const moment = require("moment-timezone");

const User = require("../models/User");
const Blog = require("../models/Blog");

const { handleError, whatFileTypeIsString } = require("./generalFunctions");

const {
  cloudinaryName,
  cloudinaryApiKey,
  cloudinaryApiSecret
} = require("../config/keys");

// Connect to cloudinary
cloudinary.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret
});
module.exports = {
  saveBlog: (req, res) => {
    let user = req.user;
    let blog3 = req.body;
    if (user && String(user._id) !== "5e38da7acaa5d60015654712") {
      res.send({ success: false });
      return;
    }
    if (blog3.deleteImageArray) {
      for (let index in blog3.deleteImageArray) {
        cloudinary.uploader.destroy(
          blog3.deleteImageArray[index],
          amazonDeleteImageResult => {}
        );
      }
    }
    const images = [];
    const pureContentArray = [];
    const { authorID, contentArray, url } = blog3;

    for (let index = 0; index < contentArray.length; index++) {
      const content = contentArray[index];
      if (!content) continue;

      content.location = index;
      if (content.size) images.push(content);
      else pureContentArray.push(content);
    }
    let newBlog = {};
    if (!blog3.id2) newBlog = new Blog(blog3);

    newBlog.authorID = authorID;
    newBlog.images = [];
    newBlog.userID = user._id;
    newBlog.url = url;
    newBlog.contentArray = pureContentArray;

    let saveBlog = newBlog => {
      let unsuccessfulSave = (newBlog, error) => {
        // Make sure images are deleted from amazon s3f if save was not successful
        let asyncCounter = 0;

        if (newBlog.images) {
          newBlog.images.forEach(image => {
            asyncCounter++;

            cloudinary.uploader.destroy(
              image.publicID,
              amazonDeleteImageResult => {
                asyncCounter--;

                if (asyncCounter === 0) handleError(res, error);
              },
              { resource_type: whatFileTypeIsString(image.url) }
            );
          });
        } else handleError(res, error);
      };
      if (blog3.id2) {
        Blog.updateOne(
          { _id: blog3.id2 },
          newBlog,
          undefined,
          (error, result) => {
            if (!error && result) res.send({ success: true });
            else unsuccessfulSave(newBlog, error);
          }
        );
      } else {
        newBlog.save((error, result) => {
          if (!error && result) res.send({ success: true, newBlog: result });
          else {
            unsuccessfulSave(newBlog, error);
          }
        });
      }
    };

    if (images.length !== 0) {
      let asyncCounter = 0;
      let continueCounter = images.length;

      for (let index in images) {
        asyncCounter++;

        const image = images[index];

        if (image.url) {
          asyncCounter--;
          continueCounter--;
          newBlog.images.push(image);
          if (continueCounter === 0) saveBlog(newBlog);

          continue;
        } else {
          cloudinary.v2.uploader.upload(
            image.file,
            { resource_type: whatFileTypeIsString(image.type) },
            (error, result) => {
              if (error) {
                if (asyncCounter === 0) return handleError(res, error);
                else handleError(undefined, error);
              } else {
                asyncCounter--;
                newBlog.images.push({
                  url: result.secure_url,
                  publicID: result.public_id,
                  size: image.size,
                  location: image.location,
                  alt: image.alt
                });

                if (asyncCounter === 0) saveBlog(newBlog);
              }
            }
          );
        }
      }
    } else {
      saveBlog(newBlog);
    }
  },
  getBlogs: (req, res) => {
    Blog.find({}, (err, blogs) => {
      if (!err && blogs) res.send({ success: true, blogs });
      else handleError(res, err);
    }).sort({ createdAt: -1 });
  },
  getBlog: (req, res) => {
    Blog.findOne({ _id: req.params.blogID }, (err, blog) => {
      if (!err && blog) res.send({ success: true, blog });
      else handleError(res, err);
    });
  }
};
