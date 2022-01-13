import firebase from 'firebase/compat/app';
import "firebase/compat/auth";

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
