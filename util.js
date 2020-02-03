const AWS = require("aws-sdk");
const fs = require("fs");
const moment = require("moment-timezone");
const Problem = require("./models/Problem");
const {
  amazonAccessKeyID,
  amazonSecretAccessKey,
  amazonBucket
} = require("./config/keys");

const s3 = new AWS.S3({
  accessKeyId: amazonAccessKeyID,
  secretAccessKey: amazonSecretAccessKey
});
const createSiteMap = () => {
  Problem.find({}, { title: 1 }, (err, problems) => {
    let siteMapString =
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/</loc>\n  <lastmod>2019-09-12</lastmod>\n  <changefreq>yearly</changefreq>\n  <priority>0.9</priority>\n</url>\n\n";
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/post-a-problem</loc>\n  <lastmod>2019-09-12</lastmod>\n  <changefreq>yearly</changefreq>\n  <priority>0.9</priority>\n</url>\n\n";
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/vent-to-a-stranger</loc>\n  <lastmod>2019-09-12</lastmod>\n  <changefreq>yearly</changefreq>\n  <priority>0.9</priority>\n</url>\n\n";
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/recent</loc>\n  <lastmod>2019-09-12</lastmod>\n  <changefreq>yearly</changefreq>\n  <priority>0.9</priority>\n</url>\n\n";
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/trending</loc>\n  <lastmod>2019-09-12</lastmod>\n  <changefreq>yearly</changefreq>\n  <priority>0.9</priority>\n</url>\n\n";

    for (let index in problems) {
      const problem = problems[index];

      let url =
        "https://www.ventwithstrangers.com/problem/" +
        problem.title +
        "?" +
        problem._id;
      url = url.replace(/ /g, "%20");
      url = url.replace(/</g, "&lt;");
      url = url.replace(/>/g, "&gt;");
      url = url.replace(/&/g, "&amp;");
      url = url.replace(/'/g, "&apos;");
      url = url.replace(/""/g, "&quot;");

      siteMapString +=
        "<url>\n  <loc>" +
        url +
        "</loc>\n  <lastmod>" +
        new moment(problem.updatedAt).format("YYYY-MM-DD") +
        "</lastmod>\n  <changefreq>yearly\n</changefreq>  <priority>0.4</priority>\n</url>\n\n";
    }
    siteMapString += "</urlset>";

    const file = new Buffer.from(siteMapString);
    const params = {
      Bucket: amazonBucket,
      Key: "sitemap.xml",
      Body: siteMapString
    };

    s3.putObject(params, (err, data) => {
      if (err) console.log(err);
    });
  });
};

const getMetaInformation = (url, callback) => {
  const defaultMetaObject = {
    metaDescription:
      "People care. Vent, chat anonymously and be apart of a community committed to making the world a better place.",
    metaImage:
      "https://res.cloudinary.com/dnc1t9z9o/image/upload/v1580431332/VENT.jpg",
    metaTitle: "We Care | Vent With Strangers"
  };

  if (url.substring(0, 10) === "/problem/") {
    Problem.find({}, (err, problems) => {
      for (let index in problems) {
        const problem = problems[index];

        const { contentArray = [] } = problem;
        if (problem.title) {
          if (problem.title === url.substring(10, url.length)) {
            let temp = {};

            return callback({
              metaDescription: problem.description.substring(0, 160) + "...",
              metaImage:
                "https://res.cloudinary.com/dnc1t9z9o/image/upload/v1580431332/VENT.jpg",
              metaTitle:
                problem.title.substring(0, 40) + " | Vent With Strangers"
            });
          }
        }
      }

      return callback(defaultMetaObject);
    });
  } else
    switch (url) {
      case "/":
        return callback(defaultMetaObject);

      case "/recent":
        return callback({
          metaDescription:
            "The latest problems and issues people have posted. Post, comment, and/or like anonymously.",
          metaImage: defaultMetaObject.metaImage,
          metaTitle: "Recent | Vent With Strangers"
        });
      case "/trending":
        return callback({
          metaDescription:
            "People’s problems and issues with the most upvotes in the past 24 hours. Post, comment, and/or like anonymously.",
          metaImage: defaultMetaObject.metaImage,
          metaTitle: "Trending | Vent With Strangers"
        });
      case "/post-a-problem":
        return callback({
          metaDescription:
            "You aren’t alone, and you should never feel alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you.",
          metaImage: defaultMetaObject.metaImage,
          metaTitle: "Post a Problem | Vent With Strangers"
        });
      case "/vent-to-a-stranger":
        return callback({
          metaDescription:
            "Sometimes, all we need is an available ear. This is where you can anonymously talk to someone that wants to listen, or anonymously listen to someone that wants to be heard.",
          metaImage: defaultMetaObject.metaImage,
          metaTitle: "Vent or Help Now | Vent With Strangers"
        });

      default:
        return callback(defaultMetaObject);
    }
};

module.exports = {
  createSiteMap,
  getMetaInformation
};
