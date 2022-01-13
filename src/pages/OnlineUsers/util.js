import firebase from 'firebase/compat/app';

export const getOnlineUsers = (callback, totalOnlineUsers) => {
  if (totalOnlineUsers > 0)
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
