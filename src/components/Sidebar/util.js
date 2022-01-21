import firebase from "firebase/compat/app";
import "firebase/compat/database";
import db from "../../config/firebase";

export const getUserAvatars = (setFirstOnlineUsers, totalOnlineUsers) => {
  if (totalOnlineUsers > 0)
    firebase
      .database()
      .ref("status")
      .orderByChild("state")
      .limitToLast(totalOnlineUsers)
      .once("value", async (snapshot) => {
        let usersOnline = [];

        snapshot.forEach((data) => {
          if (usersOnline.length >= 3) return;
          else if (data.val().state === "online") {
            usersOnline.push({
              lastOnline: data.val().last_online,
              userID: data.key,
            });
          }
        });

        usersOnline.sort((a, b) => {
          if (a.lastOnline < b.lastOnline || !a.lastOnline) return 1;
          if (a.lastOnline > b.lastOnline || !b.lastOnline) return -1;
          return 0;
        });

        const onlineUsersAvatars = [];

        for (let index in usersOnline) {
          const test = await db
            .collection("users_display_name")
            .doc(usersOnline[index].userID)
            .get();
          if (test.data()) onlineUsersAvatars.push(test.data());
        }
        setFirstOnlineUsers(onlineUsersAvatars);
      });
};
