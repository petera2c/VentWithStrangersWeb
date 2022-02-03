import { get, limitToLast, orderByChild, query, ref } from "firebase/database";
import { db2 } from "../../config/db_init";

export const getOnlineUsers = (isMounted, callback, fetchUsersCount) => {
  if (fetchUsersCount > 0)
    get(query(ref(db2, "status"), orderByChild("state"))).then((snapshot) => {
      let counter = 0;
      let usersArray = [];

      snapshot.forEach((data) => {
        if (data.val().state === "online") {
          counter++;
          usersArray.push({
            lastOnline: data.val().last_online,
            userID: data.key,
          });
        }
      });

      console.log(counter);

      usersArray.sort((a, b) => {
        if (a.lastOnline < b.lastOnline || !a.lastOnline) return 1;
        if (a.lastOnline > b.lastOnline || !b.lastOnline) return -1;
        return 0;
      });
      if (isMounted()) callback(usersArray.splice(0, fetchUsersCount));
    });
};
