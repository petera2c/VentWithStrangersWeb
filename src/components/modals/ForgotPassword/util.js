import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { message } from "antd";

export const sendPasswordReset = ({ email }) => {
  const auth = firebase.auth();

  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      // Email sent.
      message.success("Email password reset link sent!");
    })
    .catch((error) => {
      message.error(error);
    });
};
