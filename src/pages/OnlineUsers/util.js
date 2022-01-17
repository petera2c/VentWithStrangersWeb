import firebase from "firebase/compat/app";
import "firebase/compat/database";

export const getOnlineUsers = (callback, totalOnlineUsers) => {
  if (totalOnlineUsers > 0)
    firebase
      .database()
      .ref("status")
      .orderByChild("state")
      .limitToLast(totalOnlineUsers)
      .once("value", (snapshot) => {
        let usersArray = [];
        let totalOnlineUsers2 = 0;

        snapshot.forEach((data) => {
          if (data.val().state === "online") {
            usersArray.push({
              lastChanged: data.val().last_changed,
              userID: data.key,
            });
            totalOnlineUsers2++;
          }
        });

        usersArray.sort((a, b) => {
          if (a.lastChanged < b.lastChanged) return 1;
          if (a.lastChanged > b.lastChanged) return -1;
          return 0;
        });

        callback(usersArray);
      });
};
