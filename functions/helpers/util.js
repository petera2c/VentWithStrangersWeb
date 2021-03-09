const combineObjectWithID = (id, object) => {
  object.id = id;
  return object;
};

const createVentLink = (vent) => {
  let link =
    "https://www.ventwithstrangers.com/problem/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase();
  if (process.env.FUNCTIONS_EMULATOR)
    link = "http://localhost:3000/problem/" + vent.id + "/" + vent.title;

  return link;
};

module.exports = { combineObjectWithID, createVentLink };
