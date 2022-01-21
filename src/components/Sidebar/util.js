import firebase from "firebase/compat/app";
import { doc, writeBatch } from "firebase/firestore";
import "firebase/compat/database";

import db from "../../config/firebase";

export const getUserAvatars = (totalOnlineUsers) => {
  if (totalOnlineUsers > 0)
    firebase
      .database()
      .ref("status")
      .orderByChild("last_online")
      .limitToLast(totalOnlineUsers >= 3 ? 3 : totalOnlineUsers)
      .once("value", (snapshot) => {
        let usersArray = [];

        snapshot.forEach((data) => {
          if (data.val().state === "online") {
            usersArray.push({
              lastOnline: data.val().last_online,
              userID: data.key,
            });
          }
        });
        console.log(usersArray);

        const batch = writeBatch(db);

        const nycRef = doc(db, "cities", "NYC");
        //batch.set(nycRef, { name: "New York City" });
      });
};
