const moment = require("moment-timezone");
const fs = require("fs");
const Problem = require("./models/Problem");

const createSiteMap = () => {
  Problem.find({}, (err, problems) => {
    let siteMapString =
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    siteMapString +=
      "<url> <loc>https://www.ventwithstrangers.com/</loc> <lastmod>2019-09-12</lastmod> <changefreq>yearly</changefreq> <priority>0.9</priority></url>";
    siteMapString +=
      "<url> <loc>https://www.ventwithstrangers.com/post-a-problem</loc> <lastmod>2019-09-12</lastmod> <changefreq>yearly</changefreq> <priority>0.9</priority></url>";
    siteMapString +=
      "<url> <loc>https://www.ventwithstrangers.com/vent-to-a-stranger</loc> <lastmod>2019-09-12</lastmod> <changefreq>yearly</changefreq> <priority>0.9</priority></url>";

    for (let index in problems) {
      const problem = problems[index];
      siteMapString +=
        "<url><loc>https://www.ventwithstrangers.com/problems/" +
        problem.title.replace(/ /g, "%20") +
        "</loc><lastmod>" +
        new moment(problem.updatedAt).format("YYYY-MM-DD") +
        "</lastmod><changefreq>yearly</changefreq><priority>0.4</priority></url>";
    }
    siteMapString += "</urlset>";
    fs.writeFileSync("./client/public/sitemap.xml", siteMapString);
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
  if (url.substring(0, 10) === "/problems/") {
    Problem.find({}, (err, problems) => {
      for (let index in problems) {
        const problem = problems[index];
        const { contentArray = [] } = problem;
        if (problem.title) {
          if (problem.title === url.substring(10, url.length)) {
            let temp = {};

            return callback({
              metaDescription: problem.description.substring(0, 40) + "...",
              metaImage: "",
              metaTitle:
                problem.description.substring(0, 20) + "..." + " | Ghostit"
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
          metaTitle: "Home | Vent with Strangers"
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
