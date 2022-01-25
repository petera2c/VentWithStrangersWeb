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
    defaultKey: "sitemapindex.xml",
  });

const createSitemap = async () => {
  if (process.env.FUNCTIONS_EMULATOR === "true") return;
  console.log("Starting sitemap construction");
  const vents = await admin.firestore().collection("vents").get();

  let siteMapString =
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/</loc>\n<lastmod>>2022-01-24</lastmod>\n<changefreq>monthly</changefreq>\n<priority>1</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/chat-with-strangers</loc>\n<lastmod>>2022-01-24</lastmod>\n<changefreq>yearly</changefreq>\n<priority>1</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/make-friends</loc>\n<lastmod>>2022-01-24</lastmod>\n<changefreq>yearly</changefreq>\n<priority>1</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/people-online</loc>\n<lastmod>2022-01-24</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.9</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/rewards</loc>\n<lastmod>>2022-01-24</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.3</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/rules</loc>\n<lastmod>>2022-01-24</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.6</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/site-info</loc>\n<lastmod>>2022-01-24</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.6</priority>\n</url>\n\n";
  siteMapString +=
    "<url>\n<loc>https://www.ventwithstrangers.com/vent-to-strangers</loc>\n<lastmod>>2022-01-24</lastmod>\n<changefreq>yearly</changefreq>\n<priority>1</priority>\n</url>\n\n";
  console.log(vents.docs.length);

  for (let index in vents.docs) {
    const vent = vents.docs[index].data();

    if (
      !vent.description ||
      (vent.description && vent.description.length < 500)
    )
      continue;

    let url =
      "https://www.ventwithstrangers.com/vent/" +
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
      "</lastmod>\n<changefreq>yearly</changefreq>\n<priority>0.1</priority>\n</url>\n\n";
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

  const siteMapIndexString =
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<sitemap>\n<loc>https://blog.ventwithstrangers.com/sitemap.xml</loc>\n<lastmod>2022-01-25</lastmod>\n\n<sitemap>\n<loc>https://www.ventwithstrangers.com/sitemap.xml</loc>\n<lastmod>2022-01-25</lastmod>\n</sitemap>\n\n</sitemapindex>';

  const params2 = {
    Bucket: amazonBucket,
    Key: "sitemapindex.xml",
    Body: siteMapIndexString,
  };

  s3.putObject(params, (err, data) => {
    if (err) console.log(err);
  });
  console.log("finished");
};

module.exports = {
  createProxy,
  createSitemap,
};
