import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Cookies from "universal-cookie";
import { message } from "antd";
import moment from "moment-timezone";
import { db }from "../../../config/db_init";

import { displayNameErrors } from "../../../util";

const cookies = new Cookies();

export const signUp = (
  { email, displayName, password, passwordConfirm },
  navigate,
  setActiveModal
) => {
  if (displayNameErrors(displayName)) return;

  if (password !== passwordConfirm)
    return message.error("Passwords do not match.");

  const referral = cookies.get("referral");

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async (res) => {
      if (res.user) {
        res.user.sendEmailVerification();

        if (referral)
          db.collection("invited_users").doc(res.user.uid).set({
            referral_secondary_uid: referral,
          });

        await db.collection("users_settings").doc(res.user.uid).set({
          email_comment_like: true,
          email_comment_tagged: true,
          email_link_sign_up: true,
          email_promotions: true,
          email_quote_like: true,
          email_vent_commented: true,
          email_vent_like: true,
          email_vent_new: true,
          master_comment_like: true,
          master_comment_tagged: true,
          master_link_sign_up: true,
          master_quote_like: true,
          master_vent_commented: true,
          master_vent_like: true,
          master_vent_new: true,
          mobile_comment_like: true,
          mobile_comment_tagged: true,
          mobile_link_sign_up: true,
          mobile_quote_like: true,
          mobile_vent_commented: true,
          mobile_vent_like: true,
          mobile_vent_new: true,
          offensive_content: true,
        });

        await db
          .collection("users_display_name")
          .doc(res.user.uid)
          .set({
            server_timestamp: new moment(
              res.user.metadata.creationTime
            ).valueOf(),
            displayName,
          });
        await res.user.updateProfile({
          displayName,
        });
        setActiveModal(false);
        navigate("/rules");
        window.location.reload();
      }
    })
    .catch((e) => {
      alert(e);
    });
};
