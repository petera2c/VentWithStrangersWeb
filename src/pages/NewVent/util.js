import firebase from "firebase/app";
import "firebase/database";

export const saveVent = (callback, ventObject, id, user, notify) => {
  const db = firebase.database();
  let postsRef = db.ref("/posts/").push();
  if (user) {
    ventObject.userID = user.uid;
  }
  ventObject.server_timestamp = { ".sv": "timestamp" };

  if (id) postsRef = db.ref("/posts/" + id).push();

  postsRef
    .set(ventObject)
    .then(() => {
      callback({ _id: postsRef.getKey(), title: ventObject.title });
    })
    .catch((error) => alert(error.message));
};
