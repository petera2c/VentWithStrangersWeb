import firebase from "firebase/app";

export const initializeUser = (handleChange) => {
  firebase.auth().onAuthStateChanged((user) => {
    const setCurrentUserToContext = () => {
      if (
        firebase.auth().currentUser &&
        firebase.auth().currentUser.displayName
      ) {
        handleChange({ user: firebase.auth().currentUser });
      } else if (
        firebase.auth().currentUser &&
        !firebase.auth().currentUser.displayName
      ) {
        setTimeout(() => {
          setCurrentUserToContext();
        }, 500);
      } else {
        handleChange({ user: false });
      }
    };
    setCurrentUserToContext();
  });
};
