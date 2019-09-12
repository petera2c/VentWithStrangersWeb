const Problem = require("./models/Problem");

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
    Problems.find({}, (err, problems) => {
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

      default:
        return callback(defaultObject);
    }
};
module.exports = {
  getMetaInformation
};
