const moment = require("moment-timezone");
const fs = require("fs");
const Problem = require("./models/Problem");

const createSiteMap = () => {
  Problem.find({}, { title: 1 }, (err, problems) => {
    let siteMapString =
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/</loc>\n  <lastmod>2019-09-12</lastmod>\n  <changefreq>yearly\n  <priority>0.9</priority>\n</url>\n\n";
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/post-a-problem</loc>\n  <lastmod>2019-09-12</lastmod>\n  <changefreq>yearly\n  <priority>0.9</priority>\n</url>\n\n";
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/vent-to-a-stranger</loc>\n  <lastmod>2019-09-12</lastmod>\n  <changefreq>yearly\n  <priority>0.9</priority>\n</url>\n\n";
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/popular</loc>\n  <lastmod>2019-09-12</lastmod>\n  <changefreq>yearly\n  <priority>0.9</priority>\n</url>\n\n";
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/recent</loc>\n  <lastmod>2019-09-12</lastmod>\n  <changefreq>yearly\n  <priority>0.9</priority>\n</url>\n\n";
    siteMapString +=
      "<url>\n  <loc>https://www.ventwithstrangers.com/trending</loc>\n  <lastmod>2019-09-12</lastmod>\n  <changefreq>yearly\n  <priority>0.9</priority>\n</url>\n\n";

    for (let index in problems) {
      const problem = problems[index];
      siteMapString +=
        "<url>\n  <loc>https://www.ventwithstrangers.com/" +
        problem.title.replace(/ /g, "%20") +
        "?" +
        problem._id +
        "</loc>\n  <lastmod>" +
        new moment(problem.updatedAt).format("YYYY-MM-DD") +
        "</lastmod>\n  <changefreq>yearly\n  <priority>0.4</priority>\n</url>\n\n";
    }
    siteMapString += "</urlset>";
    //fs.writeFileSync(`${__dirname}/client/public/sitemap.xml`, siteMapString);
    //fs.writeFileSync(`${__dirname}/sitemap.xml`, siteMapString);
    fs.writeFile(`${__dirname}/sitemap.xml`, siteMapString, err => {
      if (err) console.log(err);
      console.log("File is created successfully.");
    });
  });
};

const getMetaInformation = (url, callback) => {
  const defaultMetaDescription = "Vent with Strangers";
  const defaultMetaImage = "";
  const defaultMetaTitle = "Home | Vent with Strangers";

  const defaultObject = {
    metaDescription: defaultMetaDescription,
    metaImage: defaultMetaImage,
    metaTitle: defaultMetaTitle
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
              metaImage: "",
              metaTitle:
                problem.title.substring(0, 40) + " | Vent with Strangers"
            });
          }
        }
      }

      return callback(defaultObject);
    });
  } else
    switch (url) {
      case "/":
        return callback({
          metaDescription: "Vent with Strangers",
          metaImage: "",
          metaTitle: "Trending | Vent with Strangers"
        });
      case "/popular":
        return callback({
          metaDescription: "Vent with Strangers",
          metaImage: "",
          metaTitle: "Popular | Vent with Strangers"
        });
      case "/recent":
        return callback({
          metaDescription: "Vent with Strangers",
          metaImage: "",
          metaTitle: "Recent | Vent with Strangers"
        });
      case "/trending":
        return callback({
          metaDescription: "Vent with Strangers",
          metaImage: "",
          metaTitle: "Trending | Vent with Strangers"
        });
      case "/post-a-problem":
        return callback({
          metaDescription: "Vent with Strangers",
          metaImage: "",
          metaTitle: "Post Problem | Vent with Strangers"
        });
      case "/vent-to-a-stranger":
        return callback({
          metaDescription: "Vent with Strangers",
          metaImage: "",
          metaTitle: "Vent or Help Now | Vent with Strangers"
        });

      default:
        return callback(defaultObject);
    }
};
module.exports = {
  createSiteMap,
  getMetaInformation
};
