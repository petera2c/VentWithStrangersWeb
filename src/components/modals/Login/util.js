import firebase from 'firebase/compat/app';
import "firebase/compat/auth";

export const login = ({ email, password }, close) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(res => {
      window.location.reload();
    })
    .catch(error => {
      alert(error);
    });
};
