import firebase from "firebase/app";
import "firebase/auth";

export const getInvalidCharacters = (displayName) => {
  const invalidCharactersArray = displayName.split(
    /[\x30-\x39|\x41-\x5A|\x61-\x7a|\x5F]+/gi
  );
  let invalidCharacters = "";

  for (let index in invalidCharactersArray) {
    invalidCharacters += invalidCharactersArray[index];
  }
  return invalidCharacters;
};

export const signUp = (
  { email, displayName, password, passwordConfirm },
  context
) => {
  const db = firebase.database();

  if (getInvalidCharacters(displayName)) {
    alert(
      "These characters are not allowed in your display name. " +
        getInvalidCharacters(displayName)
    );
    return;
  }

  if (password !== passwordConfirm) {
    alert("Passwords do not match.");
    return;
  }
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((res) => {
      if (res.user) {
        res.user.sendEmailVerification();
        db.ref("users/" + res.user.uid).set({
          profile: { displayName, email },
          settings: {
            adultContent: false,
            commentLiked: true,
            postCommented: true,
            postLiked: true,
            receiveEmails: true,
          },
        });
        res.user
          .updateProfile({
            displayName,
          })
          .then(() => {
            console.log("ere");
          })
          .catch((error) => {
            console.log(error);
          });
        window.location.reload();
      }
    })
    .catch((e) => {
      context.notify(e);
    });
};
