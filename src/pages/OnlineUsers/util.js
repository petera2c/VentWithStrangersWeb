export const getOnlineUsers = (callback, totalOnlineUsers) => {
  firebase
    .database()
    .ref("status")
    .orderByChild("state")
    .limitToLast(totalOnlineUsers)
    .once("value", snapshot => {
      let totalOnlineUsers2 = 0;
      let some = [];
      snapshot.forEach(data => {
        if (data.val().state === "online") {
          console.log(data.val());
          some.push(data.key);
          totalOnlineUsers2++;
        }
      });
      console.log(some);
      console.log(totalOnlineUsers2);
    });
};
