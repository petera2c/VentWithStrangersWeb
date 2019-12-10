const Tag = require("../models/Tag");

const getTrendingTags = (req, res) => {
  Tag.find({}, (err, tags) => {
    res.send({ success: true, tags });
  })
    .sort({ uses: -1 })
    .limit(8);
};
module.exports = {
  getTrendingTags
};
