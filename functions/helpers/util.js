const admin = require("firebase-admin");

const calculateKarma = (usereBasicInfo) => {
  return usereBasicInfo.karma ? usereBasicInfo.karma : 0;
};

const calculateKarmaUserCanStrip = (usereBasicInfo) => {
  if (!usereBasicInfo) return 5;

  if (usereBasicInfo.karma > 1000) return 200;
  else if (usereBasicInfo.karma > 500) return 100;
  else if (usereBasicInfo.karma > 250) return 50;
  else if (usereBasicInfo.karma > 100) return 20;
  else if (usereBasicInfo.karma > 50) return 10;
  else if (usereBasicInfo.karma > 0) return 5;
};

const combineObjectWithID = (id, object) => {
  object.id = id;
  return object;
};

const createProfileLink = (userID) => {
  let link = "https://www.ventwithstrangers.com/profile?" + userID;
  if (process.env.FUNCTIONS_EMULATOR)
    link = "http://localhost:3000/profile?" + userID;

  return link;
};

const createRewardsLink = () => {
  return "/rewards";
};

const createVentLink = (vent) => {
  return (
    "/problem/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase()
  );
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
  const userObjectID = url.split("/profile?")[1];
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
      return callback(
        {
          metaDescription: vent.description
            ? vent.description.substring(0, 200)
            : "",
          metaImage: defaultMetaObject.metaImage,
          metaTitle:
            (vent.title ? vent.title.substring(0, 140) : "") +
            " | Vent With Strangers",
        },
        Boolean(ventDoc.id),
        { id: ventDoc.id, ...vent }
      );
    else return callback(defaultMetaObject);
  } else if (userObjectID) {
    return callback(
      {
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Account | Vent With Strangers",
        metaDescription: "",
      },
      true
    );
  } else if (url === "/")
    return callback(
      {
        metaDescription:
          "People’s problems and issues with the most upvotes in the past 24 hours. Post, comment, and/or like anonymously.",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "We Care | Vent With Strangers",
      },
      true
    );
  else if (url === "/recent")
    return callback(
      {
        metaDescription:
          "The latest problems and issues people have posted. Post, comment, and/or like anonymously.",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Recent | Vent With Strangers",
      },
      true
    );
  else if (url === "/trending")
    return callback(
      {
        metaDescription:
          "People’s problems and issues with the most upvotes in the past 24 hours. Post, comment, and/or like anonymously.",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Trending | Vent With Strangers",
      },
      true
    );
  else if (url === "/make-friends")
    return callback(
      {
        metaDescription: "Make friends online on vent with strangers!",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Make Friends | Vent With Strangers",
      },
      true
    );
  else if (url === "/vent-to-strangers")
    return callback(
      {
        metaDescription:
          "Vent to strangers. You aren’t alone, and you should never feel alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you.",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Post a Vent | Vent With Strangers",
      },
      true
    );
  else if (url === "/vent-to-a-stranger")
    return callback(
      {
        metaDescription:
          "Chat anonymously and post a vent anonymously. Find strangers just like you to vent with. We are here to listen, you are not alone.",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Chat and Post Anonymously | Vent With Strangers",
      },
      true
    );
  else if (url === "/site-info")
    return callback(
      {
        metaDescription: "Learn about Vent With Strangers",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Site Info | Vent With Strangers",
      },
      true
    );
  else if (url.substring(0, 14) === "/conversations")
    return callback(
      {
        metaDescription: "",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Inbox | Vent With Strangers",
      },
      true
    );
  else if (url.substring(0, 14) === "/profile")
    return callback(
      {
        metaDescription: "",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Profile | Vent With Strangers",
      },
      true
    );
  else if (url.substring(0, 14) === "/account")
    return callback(
      {
        metaDescription: "",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Account | Vent With Strangers",
      },
      true
    );
  else if (url.substring(0, 14) === "/avatar")
    return callback(
      {
        metaDescription: "",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Avatar | Vent With Strangers",
      },
      true
    );
  else if (url.substring(0, 14) === "/settings")
    return callback(
      {
        metaDescription: "",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Settings | Vent With Strangers",
      },
      true
    );
  else if (url === "/privacy-policy")
    return callback(
      {
        metaDescription: "",
        metaImage: defaultMetaObject.metaImage,
        metaTitle: "Privacy Policy | Vent With Strangers",
      },
      true
    );
  else return callback(defaultMetaObject, false);
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

const updateTotalUsersOnline = (change, context) => {
  const setToDatabase = (state) => {
    if (state === "online") {
      admin
        .database()
        .ref("total_online_users")
        .set(admin.database.ServerValue.increment(1));
    } else if (state === "offline") {
      admin
        .database()
        .ref("total_online_users")
        .set(admin.database.ServerValue.increment(-1));
    }
  };

  const changeAfter = change.after;
  const changeBefore = change.before;

  if (!changeAfter.val() && !changeAfter.val()) {
    // Do nothing, should never happen
  } else if (!changeBefore.val()) {
    // New doc
    // console.log("new doc");

    if (changeAfter.val().state === "online")
      setToDatabase(changeAfter.val().state);
  } else if (!changeAfter.val()) {
    // Doc deleted
    // console.log("doc deleted");

    setToDatabase(changeBefore.val().state === "online" ? "offline" : "");
  } else {
    // Doc updated
    // console.log("doc updated");

    if (changeBefore.val().state !== changeAfter.val().state) {
      // console.log("updated with different values");
      setToDatabase(changeAfter.val().state);
    }
  }
  return 10;
};

module.exports = {
  calculateKarma,
  calculateKarmaUserCanStrip,
  combineObjectWithID,
  createProfileLink,
  createRewardsLink,
  createVentLink,
  getMetaInformation,
  updateTotalUsersOnline,
};
