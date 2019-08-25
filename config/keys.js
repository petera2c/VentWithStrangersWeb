if (process.env.NODE_ENV === "production") {
  module.exports = require("./ProductionKeys");
} else {
  module.exports = require("./localKeys");
}
