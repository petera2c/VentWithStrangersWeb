import { get, limitToLast, orderByChild, query, ref } from "firebase/database";
import { db2 } from "../../config/firebase_init";

export const getOnlineUsers = (
  isMounted,
  setCanLoadMoreUsers,
  setOnlineUsers,
  fetchUsersCount
) => {
  if (fetchUsersCount > 0)
    get(
      query(
        ref(db2, "status"),
        limitToLast(fetchUsersCount),
        orderByChild("index")
      )
    ).then((snapshot) => {
      let usersArray = [];

      snapshot.forEach((data) => {
        if (data.val().state === "online") {
          usersArray.unshift({
            lastOnline: data.val().index,
            userID: data.key,
          });
        }
      });

      if (isMounted()) {
        if (usersArray.length < fetchUsersCount) setCanLoadMoreUsers(false);
        setOnlineUsers(usersArray);
      }
    });
};
