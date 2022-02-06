import { get, limitToLast, orderByChild, query, ref } from "firebase/database";
import { db2 } from "../../config/db_init";

export const getOnlineUsers = (isMounted, callback, fetchUsersCount) => {
  if (fetchUsersCount > 0)
    get(
      query(
        ref(db2, "status"),
        limitToLast(fetchUsersCount),
        orderByChild("index")
      )
    ).then((snapshot) => {
      let counter = 0;
      let usersArray = [];

      snapshot.forEach((data) => {
        if (data.val().state === "online") {
          counter++;
          usersArray.unshift({
            lastOnline: data.val().index,
            userID: data.key,
          });
        }
      });

      console.log(counter);

      if (isMounted()) callback(usersArray);
    });
};
