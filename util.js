const AWS = require("aws-sdk");
const fs = require("fs");
const moment = require("moment-timezone");
const jsdom = require("jsdom");

const Blog = require("./models/Blog");
const Problem = require("./models/Problem");
const User = require("./models/User");
const {
  amazonAccessKeyID,
  amazonSecretAccessKey,
  amazonBucket
} = require("./config/keys");

const { JSDOM } = jsdom;

const s3 = new AWS.S3({
  accessKeyId: amazonAccessKeyID,
  secretAccessKey: amazonSecretAccessKey
});
const createSiteMap = () => {
  Problem.find({}, { title: 1 }, (err, problems) => {
    Blog.find({}, { updatedAt: 1, url: 1 }, (err, blogs) => {
      let siteMapString =
        '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';
      siteMapString +=
        "<url>\n  <loc>https://www.ventwithstrangers.com/</loc>\n  <lastmod>" +
        new moment().format("YYYY-MM-DD") +
        "</lastmod>\n  <changefreq>daily</changefreq>\n  <priority>1</priority>\n</url>\n\n";
      siteMapString +=
        "<url>\n  <loc>https://www.ventwithstrangers.com/post-a-problem</loc>\n  <lastmod>2020-02-04</lastmod>\n  <changefreq>yearly</changefreq>\n  <priority>0.8</priority>\n</url>\n\n";
      siteMapString +=
        "<url>\n  <loc>https://www.ventwithstrangers.com/vent-to-a-stranger</loc>\n  <lastmod>2020-02-04</lastmod>\n  <changefreq>yearly</changefreq>\n  <priority>0.8</priority>\n</url>\n\n";
      siteMapString +=
        "<url>\n  <loc>https://www.ventwithstrangers.com/recent</loc>\n  <lastmod>" +
        new moment().format("YYYY-MM-DD") +
        "</lastmod>\n  <changefreq>daily</changefreq>\n  <priority>0.8</priority>\n</url>\n\n";
      siteMapString +=
        "<url>\n  <loc>https://www.ventwithstrangers.com/trending</loc>\n  <lastmod>" +
        new moment().format("YYYY-MM-DD") +
        "</lastmod>\n  <changefreq>daily</changefreq>\n  <priority>0.8</priority>\n</url>\n\n";

      for (let index in problems) {
        const problem = problems[index];

        let url =
          "https://www.ventwithstrangers.com/problem/" +
          problem._id +
          "/" +
          problem.title
            .replace(/[^a-zA-Z ]/g, "")
            .replace(/ /g, "-")
            .toLowerCase();

        siteMapString +=
          "<url>\n  <loc>" +
          url +
          "</loc>\n  <lastmod>" +
          new moment(problem.updatedAt).format("YYYY-MM-DD") +
          "</lastmod>\n  <changefreq>monthly\n</changefreq>  <priority>0.4</priority>\n</url>\n\n";
      }
      for (let index in blogs) {
        const blog = blogs[index];
        siteMapString +=
          "<url>\n  <loc>" +
          "https://www.ventwithstrangers.com/blog/" +
          blog._id +
          "/" +
          blog.url +
          "</loc>\n  <lastmod>" +
          new moment(blog.updatedAt).format("YYYY-MM-DD") +
          "</lastmod>\n  <changefreq>daily\n</changefreq>  <priority>0.8</priority>\n</url>\n\n";
      }

      siteMapString += "</urlset>";

      const params = {
        Bucket: amazonBucket,
        Key: "sitemap.xml",
        Body: siteMapString
      };

      s3.putObject(params, (err, data) => {
        if (err) console.log(err);
      });
    });
  });
};

const getMetaInformation = (url, callback) => {
  if (url && url[1] === "?") url = "/";
  const defaultMetaObject = {
    metaDescription:
      "Vent, and chat anonymously to be apart of a community committed to making the world a happier place.",
    metaImage:
      "https://res.cloudinary.com/dnc1t9z9o/image/upload/v1580431332/VENT.jpg",
    metaTitle: "We Care | Vent With Strangers"
  };

  const checkIsProblem = url.match(/(?<=\/problem\/\s*).*?(?=\s*\/)/gs);
  const checkIsBlog = url.match(/(?<=\/blog\/\s*).*?(?=\s*\/)/gs);
  const userObjectID = url.split("/activity?")[1];
  let problemObjectID;
  let blogObjectID;
  if (checkIsProblem) problemObjectID = checkIsProblem[0];
  if (checkIsBlog) blogObjectID = checkIsBlog[0];

  if (checkIsProblem && problemObjectID) {
    Problem.findById(problemObjectID, (err, problem) => {
      if (!err && problem)
        return callback({
          metaDescription: problem.description
            ? problem.description.substring(0, 200)
            : "",
          metaImage: defaultMetaObject.metaImage,
          metaTitle: problem.title + " | Vent With Strangers"
        });
      else return callback(defaultMetaObject);
    });
  } else if (checkIsBlog && blogObjectID) {
    Blog.findById(blogObjectID, (err, blog) => {
      const { contentArray = [], images = [] } = blog;
      let temp = {};
      if (contentArray[0]) temp = JSDOM.fragment(contentArray[0].html);

      let metaTitle = defaultMetaObject.metaTitle;
      if (temp.firstChild) metaTitle = temp.firstChild.textContent;

      let temp2 = {};
      if (contentArray[1]) temp2 = JSDOM.fragment(contentArray[1].html);

      let metaDescription = defaultMetaObject.metaDescription;
      if (temp2.firstChild)
        metaDescription = temp2.firstChild.textContent
          ? temp2.firstChild.textContent.substring(0, 200)
          : defaultMetaObject.metaDescription;

      let metaImage = defaultMetaObject.metaImage;
      if (images[0]) metaImage = images[0].url;
      if (!err && blog)
        return callback({
          metaDescription: metaDescription,
          metaImage: metaImage,
          metaTitle: metaTitle + " | Vent With Strangers"
        });
      else return callback(defaultMetaObject);
    });
  } else if (userObjectID) {
    User.findById(userObjectID, (err, user) => {
      if (!err && user)
        return callback({
          metaImage: defaultMetaObject.metaImage,
          metaTitle: "Account | Vent With Strangers"
        });
      else return callback(defaultMetaObject);
    });
  } else if (url === "/")
    return callback({
      metaDescription:
        "People’s problems and issues with the most upvotes in the past 24 hours. Post, comment, and/or like anonymously.",
      metaImage: defaultMetaObject.metaImage,
      metaTitle: "We Care | Vent With Strangers"
    });
  else if (url.substring(0, 7) === "/recent")
    return callback({
      metaDescription:
        "The latest problems and issues people have posted. Post, comment, and/or like anonymously.",
      metaImage: defaultMetaObject.metaImage,
      metaTitle: "Recent | Vent With Strangers"
    });
  else if (url.substring(0, 9) === "/trending")
    return callback({
      metaDescription:
        "People’s problems and issues with the most upvotes in the past 24 hours. Post, comment, and/or like anonymously.",
      metaImage: defaultMetaObject.metaImage,
      metaTitle: "Trending | Vent With Strangers"
    });
  else if (url === "/post-a-problem")
    return callback({
      metaDescription:
        "You aren’t alone, and you should never feel alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you.",
      metaImage: defaultMetaObject.metaImage,
      metaTitle: "Post a Problem | Vent With Strangers"
    });
  else if (url === "/vent-to-a-stranger")
    return callback({
      metaDescription:
        "Sometimes, all we need is an available ear. This is where you can anonymously talk to someone that wants to listen, or anonymously listen to someone that wants to be heard.",
      metaImage: defaultMetaObject.metaImage,
      metaTitle: "Chat | Vent With Strangers"
    });
  else return callback(defaultMetaObject);
};

module.exports = {
  createSiteMap,
  getMetaInformation
};
