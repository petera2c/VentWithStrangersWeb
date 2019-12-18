const Tag = require("../models/Tag");
const User = require("../models/User");

const getTrendingTags = (req, res) => {
  Tag.find({}, (err, tags) => {
    res.send({ success: true, tags });
  })
    .sort({ uses: -1 })
    .limit(8);
};
const updateRecentTags = (req, res) => {
  const { selectedTags } = req.body;
  const { user } = req;

  let counter = 0;

  for (let index in selectedTags) {
    const selectedTag = selectedTags[index];
    counter++;

    Tag.findOne({ name: selectedTag.name }, (err, tag) => {
      counter--;

      if (tag && user) {
        const pastUseOfTag = user.recentTags.findIndex(
          recentTag => recentTag.name === tag.name
        );
        if (pastUseOfTag !== -1) user.recentTags.splice(pastUseOfTag, 1);

        user.recentTags.unshift({ name: tag.name });
      }

      if (counter === 0) {
        user.save((err, result) => {
          res.send({ success: true, user: result });
        });
      }
    });
  }
};
module.exports = {
  getTrendingTags,
  updateRecentTags
};
