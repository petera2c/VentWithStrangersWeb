import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export const login = ({ email, password }, setActiveModal) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      setActiveModal();
      //window.location.reload();
    })
    .catch((error) => {
      alert(error);
    });
};
