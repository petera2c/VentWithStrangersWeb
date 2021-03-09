const admin = require("firebase-admin");

const moment = require("moment-timezone");
const s3Proxy = require("s3-proxy");
const AWS = require("aws-sdk");

const {
  amazonAccessKeyID,
  amazonSecretAccessKey,
  amazonBucket,
} = require("../config/localKeys");

const s3 = new AWS.S3({
  accessKeyId: amazonAccessKeyID,
  secretAccessKey: amazonSecretAccessKey,
});

const createProxy = () =>
  s3Proxy({
    bucket: amazonBucket,
    accessKeyId: amazonAccessKeyID,
    secretAccessKey: amazonSecretAccessKey,
    overrideCacheControl: "max-age=100000",
    defaultKey: "sitemap.xml",
  });

const createSitemap = async () => {
  const vents = await admin
    .firestore()
    .collection("vents")
    .get();

  let siteMapString =
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/</loc>\n<lastmod>" +
    new moment().format("YYYY-MM-DD") +
    "</lastmod>\n<changefreq>daily</changefreq>\n<priority>1</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/post-a-problem</loc>\n<lastmod>2020-02-04</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.8</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/vent-to-a-stranger</loc>\n<lastmod>2020-02-04</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.8</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/recent</loc>\n<lastmod>" +
    new moment().format("YYYY-MM-DD") +
    "</lastmod>\n<changefreq>daily</changefreq>\n<priority>0.8</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/trending</loc>\n<lastmod>" +
    new moment().format("YYYY-MM-DD") +
    "</lastmod>\n<changefreq>daily</changefreq>\n<priority>0.8</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/app-downloads</loc>\n<lastmod>2020-05-26</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.2</priority>\n</url>\n\n";

  for (let index in vents.docs) {
    const vent = vents.docs[index].data();

    let url =
      "https://www.ventwithstrangers.com/problem/" +
      vent._id +
      "/" +
      vent.title
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/ /g, "-")
        .toLowerCase();

    siteMapString +=
      "<url>\n<loc>" +
      url +
      "</loc>\n<lastmod>" +
      new moment(vent.server_timestamp).format("YYYY-MM-DD") +
      "</lastmod>\n<changefreq>monthly</changefreq>\n</url>\n\n";
  }

  siteMapString += "</urlset>";

  const params = {
    Bucket: amazonBucket,
    Key: "sitemap.xml",
    Body: siteMapString,
  };
  return params;

  s3.putObject(params, (err, data) => {
    if (err) console.log(err);
  });
};

module.exports = {
  createProxy,
  createSitemap,
};
