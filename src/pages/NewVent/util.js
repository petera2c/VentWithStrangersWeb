import db from "../../config/firebase";

export const saveVent = async (callback, ventObject, id, user, notify) => {
  if (user) {
    ventObject.userID = user.uid;
  }
  ventObject.server_timestamp = { ".sv": "timestamp" };
  ventObject.commentCounter = 0;
  ventObject.likeCounter = 0;

  const newVent = await db.collection("/vents/").add(ventObject);
  callback({ _id: newVent.id, title: ventObject.title });
};
