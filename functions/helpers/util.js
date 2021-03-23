const admin = require("firebase-admin");

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

const getMetaInformation = async (url, callback) => {
  if (url && url[1] === "?") url = "/";
  const defaultMetaObject = {
    metaDescription:
      "Vent, and chat anonymously to be apart of a community committed to making the world a happier place.",
    metaImage:
      "https://res.cloudinary.com/dnc1t9z9o/image/upload/v1580431332/VENT.jpg",
    metaTitle: "We Care | Vent With Strangers",
  };

  const checkIsVent = url.match(/(?<=\/problem\/\s*).*?(?=\s*\/)/gs);
  const userObjectID = url.split("/activity?")[1];
  let ventID;
  if (checkIsVent) ventID = checkIsVent[0];

  if (checkIsVent && ventID) {
    const ventDoc = await admin
      .firestore()
      .collection("vents")
      .doc(ventID)
      .get();
    const vent = ventDoc.data();

    if (vent)
      return callback({
        metaDescription: vent.description
          ? vent.description.substring(0, 200)
          : "",
        metaImage: defaultMetaObject.metaImage,
        metaTitle:
          (vent.title ? vent.title.substring(0, 140) : "") +
          " | Vent With Strangers",
      });
    else return callback(defaultMetaObject);
  } else if (userObjectID) {
    return callback({
      metaImage: defaultMetaObject.metaImage,
      metaTitle: "Account | Vent With Strangers",
      metaDescription: "",
    });
  } else if (url === "/")
    return callback({
      metaDescription:
        "People’s problems and issues with the most upvotes in the past 24 hours. Post, comment, and/or like anonymously.",
      metaImage: defaultMetaObject.metaImage,
      metaTitle: "We Care | Vent With Strangers",
    });
  else if (url.substring(0, 7) === "/recent")
    return callback({
      metaDescription:
        "The latest problems and issues people have posted. Post, comment, and/or like anonymously.",
      metaImage: defaultMetaObject.metaImage,
      metaTitle: "Recent | Vent With Strangers",
    });
  else if (url.substring(0, 9) === "/trending")
    return callback({
      metaDescription:
        "People’s problems and issues with the most upvotes in the past 24 hours. Post, comment, and/or like anonymously.",
      metaImage: defaultMetaObject.metaImage,
      metaTitle: "Trending | Vent With Strangers",
    });
  else if (url === "/vent-to-strangers")
    return callback({
      metaDescription:
        "You aren’t alone, and you should never feel alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you.",
      metaImage: defaultMetaObject.metaImage,
      metaTitle: "Post a Vent | Vent With Strangers",
    });
  else return callback(defaultMetaObject);
};

const getInvalidDisplayNameCharacters = (displayName) => {
  const invalidCharactersArray = displayName.split(
    /[\x30-\x39|\x41-\x5A|\x61-\x7a|\x5F]+/gi
  );
  let invalidCharacters = "";

  for (let index in invalidCharactersArray) {
    invalidCharacters += invalidCharactersArray[index];
  }
  return invalidCharacters;
};

module.exports = {
  combineObjectWithID,
  createVentLink,
  getMetaInformation,
};
