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
      "<url>\n  <loc>https://www.ventwithstrangers.com/</loc>\n  <lastmod>" +
      new moment().format("YYYY-MM-DD") +
      "</lastmod>\n  <changefreq>daily</changefreq>\n  <priority>1</priority>\n</url>\n\n";
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/post-a-problem</loc>\n  <lastmod>2020-02-04</lastmod>\n  <changefreq>daily</changefreq>\n  <priority>0.8</priority>\n</url>\n\n";
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/vent-to-a-stranger</loc>\n  <lastmod>2020-02-04</lastmod>\n  <changefreq>daily</changefreq>\n  <priority>0.8</priority>\n</url>\n\n";
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
        "</lastmod>\n  <changefreq>daily\n</changefreq>  <priority>0.4</priority>\n</url>\n\n";
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
      "People care. Vent, and chat anonymously and be apart of a community committed to making the world a better place.",
    metaImage:
      "https://res.cloudinary.com/dnc1t9z9o/image/upload/v1580431332/VENT.jpg",
    metaTitle: "We Care | Vent With Strangers"
  };

  const regexMatch = url.match(/(?<=\/problem\/\s*).*?(?=\s*\/)/gs);
  let problemID;
  if (regexMatch) problemID = regexMatch[0];
  console.log(problemID);

  if (problemID) {
    Problem.findById(problemID, (err, problem) => {
      if (!err && problem) {
        console.log(problem.title);
        return callback({
          metaDescription: problem.description,
          metaImage: defaultMetaObject.metaImage,
          metaTitle: problem.title + " | Vent With Strangers"
        });
      } else return callback(defaultMetaObject);
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
          metaTitle: "Chat | Vent With Strangers"
        });

      default:
        return callback(defaultMetaObject);
    }
};

module.exports = {
  createSiteMap,
  getMetaInformation
};
