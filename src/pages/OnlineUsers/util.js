import { get, limitToLast, orderByChild, ref } from "firebase/database";
import { db2 } from "../../config/localhost_init";

export const getOnlineUsers = (isMounted, callback, totalOnlineUsers) => {
  if (totalOnlineUsers > 0)
    get(
      ref(db2, "status"),
      orderByChild("state"),
      limitToLast(totalOnlineUsers)
    ).then((snapshot) => {
      let usersArray = [];

      snapshot.forEach((data) => {
        if (data.val().state === "online") {
          usersArray.push({
            lastOnline: data.val().last_online,
            userID: data.key,
          });
        }
      });

      usersArray.sort((a, b) => {
        if (a.lastOnline < b.lastOnline || !a.lastOnline) return 1;
        if (a.lastOnline > b.lastOnline || !b.lastOnline) return -1;
        return 0;
      });
      if (isMounted.current) callback(usersArray);
    });
};
