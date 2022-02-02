import { getAuth } from "firebase/auth";

import { message } from "antd";

export const sendPasswordReset = ({ email }) => {
  getAuth()
    .sendPasswordResetEmail(email)
    .then(() => {
      // Email sent.
      message.success("Email password reset link sent!");
    })
    .catch((error) => {
      message.error(error);
    });
};
