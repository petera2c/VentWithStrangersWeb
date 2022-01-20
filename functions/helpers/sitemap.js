const admin = require("firebase-admin");

const moment = require("moment-timezone");
const s3Proxy = require("s3-proxy");
const AWS = require("aws-sdk");

const {
  amazonAccessKeyID,
  amazonSecretAccessKey,
  amazonBucket,
} = require("../config/keys");

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
  if (process.env.FUNCTIONS_EMULATOR === "true") return;
  console.log("Starting sitemap construction");
  const vents = await admin.firestore().collection("vents").get();

  let siteMapString =
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/</loc>\n<lastmod>" +
    new moment().format("YYYY-MM-DD") +
    "</lastmod>\n<changefreq>daily</changefreq>\n<priority>1</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/recent</loc>\n<lastmod>" +
    new moment().format("YYYY-MM-DD") +
    "</lastmod>\n<changefreq>daily</changefreq>\n<priority>0.8</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/trending</loc>\n<lastmod>" +
    new moment().format("YYYY-MM-DD") +
    "</lastmod>\n<changefreq>daily</changefreq>\n<priority>0.8</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/vent-to-strangers</loc>\n<lastmod>2021-03-13</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.8</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/make-friends</loc>\n<lastmod>2022-01-03</lastmod>\n<changefreq>yearly</changefreq>\n<priority>1</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/chat-with-strangers</loc>\n<lastmod>2022-01-19</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.9</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/site-info</loc>\n<lastmod>2021-06-17</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.6</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/conversations</loc>\n<lastmod>2022-01-04</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.6</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/rewards</loc>\n<lastmod>2022-01-19</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.6</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/rules</loc>\n<lastmod>2022-01-19</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.6</priority>\n</url>\n\n";

  for (let index in vents.docs) {
    const vent = vents.docs[index].data();

    let url =
      "https://www.ventwithstrangers.com/problem/" +
      vents.docs[index].id +
      "/" +
      vent.title
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/ /g, "-")
        .toLowerCase();

    siteMapString +=
      "<url>\n<loc>" +
      url +
      "</loc>\n<lastmod>" +
      new moment(
        vent.last_updated ? vent.last_updated : vent.server_timestamp
      ).format("YYYY-MM-DD") +
      "</lastmod>\n<changefreq>daily</changefreq>\n</url>\n\n";
  }

  siteMapString += "</urlset>";

  const params = {
    Bucket: amazonBucket,
    Key: "sitemap.xml",
    Body: siteMapString,
  };

  s3.putObject(params, (err, data) => {
    if (err) console.log(err);
  });
};

module.exports = {
  createProxy,
  createSitemap,
};
