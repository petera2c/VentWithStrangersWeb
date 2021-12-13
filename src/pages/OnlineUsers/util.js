import firebase from "firebase/app";

export const getOnlineUsers = (callback, totalOnlineUsers) => {
  firebase
    .database()
    .ref("status")
    .orderByChild("state")
    .limitToLast(totalOnlineUsers)
    .once("value", snapshot => {
      let usersArray = [];
      let totalOnlineUsers2 = 0;

      snapshot.forEach(data => {
        if (data.val().state === "online") {
          usersArray.push(data.key);
          totalOnlineUsers2++;
        }
      });

      console.log(totalOnlineUsers2);
      callback(usersArray);
    });
};
