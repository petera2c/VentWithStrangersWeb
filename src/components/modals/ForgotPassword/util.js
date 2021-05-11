import firebase from "firebase/app";
import "firebase/auth";

export const sendPasswordReset = ({ email }) => {
  const auth = firebase.auth();

  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      // Email sent.
      alert("Email password reset link sent!");
    })
    .catch(error => {
      alert("error");
    });
};
