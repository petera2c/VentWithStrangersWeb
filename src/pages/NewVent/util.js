import firebase from "firebase/app";
import "firebase/database";

export const saveVent = (callback, ventObject, id, user, notify) => {
  const db = firebase.database();
  let postsRef = db.ref("/vents/").push();
  if (user) {
    ventObject.userID = user.uid;
  }
  ventObject.server_timestamp = { ".sv": "timestamp" };
  ventObject.commentCounter = 0;
  ventObject.likeCounter = 0;

  if (id) postsRef = db.ref("/vents/" + id).push();

  postsRef
    .set(ventObject)
    .then(() => {
      callback({ _id: postsRef.getKey(), title: ventObject.title });
    })
    .catch(error => alert(error.message));
};
