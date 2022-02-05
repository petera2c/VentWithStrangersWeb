import { doc, getDoc } from "firebase/firestore";
import { get, limitToLast, orderByChild, query, ref } from "firebase/database";

import { db, db2 } from "../../config/db_init";

export const getUserAvatars = (isMounted, setFirstOnlineUsers) => {
  get(query(ref(db2, "status"), orderByChild("index"), limitToLast(3))).then(
    async (snapshot) => {
      let usersOnline = [];

      snapshot.forEach((data) => {
        if (data.val().state === "online") {
          usersOnline.push({
            lastOnline: data.val().last_online,
            userID: data.key,
          });
        }
      });

      const onlineUsersAvatars = [];

      for (let i in usersOnline) {
        const userBasicInfoDoc = await getDoc(
          doc(db, "users_display_name", usersOnline[i].userID)
        );

        if (userBasicInfoDoc.data())
          onlineUsersAvatars.unshift({
            id: userBasicInfoDoc.id,
            ...userBasicInfoDoc.data(),
          });
      }

      if (isMounted()) setFirstOnlineUsers(onlineUsersAvatars);
    }
  );
};
