import { doc, getDoc } from "firebase/firestore";
import { get, limitToLast, orderByChild, ref } from "firebase/database";

import { db, db2 } from "../../config/localhost_init";

export const getUserAvatars = (setFirstOnlineUsers, totalOnlineUsers) => {
  if (totalOnlineUsers > 0)
    get(
      ref(db2, "status"),
      orderByChild("state"),
      limitToLast(totalOnlineUsers)
    ).then(async (snapshot) => {
      let usersOnline = [];

      snapshot.forEach((data) => {
        if (data.val().state === "online") {
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

      for (
        let i = 0;
        i < (usersOnline.length >= 3 ? 3 : usersOnline.length);
        i++
      ) {
        const userBasicInfoDoc = await getDoc(
          doc(db, "users_display_name", usersOnline[i].userID)
        );

        if (userBasicInfoDoc.data())
          onlineUsersAvatars.push({
            id: userBasicInfoDoc.id,
            ...userBasicInfoDoc.data(),
          });
      }

      setFirstOnlineUsers(onlineUsersAvatars);
    });
};
