import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import Cookies from "universal-cookie";
import { message } from "antd";
import moment from "moment-timezone";
import db from "../../../config/firebase";

const cookies = new Cookies();

export const getInvalidCharacters = displayName => {
  const invalidCharactersArray = displayName.split(
    /[\x30-\x39|\x41-\x5A|\x61-\x7a|\x5F]+/gi
  );
  let invalidCharacters = "";

  for (let index in invalidCharactersArray) {
    invalidCharacters += invalidCharactersArray[index];
  }
  return invalidCharacters;
};

export const signUp = ({ email, displayName, password, passwordConfirm }) => {
  if (getInvalidCharacters(displayName)) {
    return message.error(
      "These characters are not allowed in your display name. " +
        getInvalidCharacters(displayName)
    );
  }

  if (password !== passwordConfirm) {
    return message.error("Passwords do not match.");
  }

  const referral = cookies.get("referral");

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async res => {
      if (res.user) {
        res.user.sendEmailVerification();

        if (referral)
          db.collection("invited_users")
            .doc(res.user.uid)
            .set({
              referral_secondary_uid: referral
            });

        await db
          .collection("users_settings")
          .doc(res.user.uid)
          .set({
            master_vent_commented: true,
            master_comment_like: true,
            master_vent_like: true,
            master_comment_tagged: true,
            master_vent_new: true,
            email_vent_commented: true,
            email_comment_like: true,
            email_vent_like: true,
            email_comment_tagged: true,
            email_vent_new: true,
            email_promotions: true,
            mobile_vent_commented: true,
            mobile_comment_like: true,
            mobile_vent_like: true,
            mobile_comment_tagged: true,
            mobile_vent_new: true,
            offensive_content: true
          });
        await db
          .collection("users_display_name")
          .doc(res.user.uid)
          .set({
            server_timestamp: new moment(
              res.user.metadata.creationTime
            ).valueOf(),
            displayName
          });
        await res.user.updateProfile({
          displayName
        });
        window.location.reload();
      }
    })
    .catch(e => {
      alert(e);
    });
};
