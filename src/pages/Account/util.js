import db from "../../config/firebase";

export const getUser = async (callback, userID) => {
  if (!userID) {
    alert("Reload the page please. An unexpected error has occurred.");
    return {};
  }

  const authorDoc = await db
    .collection("users_info")
    .doc(userID)
    .get();

  callback(authorDoc.exists ? { ...authorDoc.data(), id: authorDoc.id } : {});
};

export const updateUser = async (
  birthDate,
  confirmPassword,
  displayName,
  email,
  gender,
  newPassword,
  pronouns,
  user,
  userInfo
) => {
  let changesFound = false;

  if (
    userInfo.birth_date != birthDate.valueOf() ||
    userInfo.gender !== gender ||
    userInfo.pronouns !== pronouns
  ) {
    changesFound = true;
    if (userInfo.gender && userInfo.gender.length > 20)
      alert("Gender can only be a maximum of 20 characters.");
    if (userInfo.pronouns && userInfo.pronouns.length > 20)
      alert("Pronouns can only be a maximum of 20 characters.");

    await db
      .collection("users_info")
      .doc(user.uid)
      .set(
        { birth_date: birthDate.valueOf(), gender, pronouns },
        { merge: true }
      );
    alert("Your account information has been changed");
  }
  if (displayName && displayName !== user.displayName) {
    changesFound = true;
    user
      .updateProfile({
        displayName
      })
      .then(async () => {
        await db
          .collection("users_display_name")
          .doc(user.uid)
          .update({ displayName });
        alert("Display name updated!");
      })
      .catch(error => {
        alert(error.message);
      });
  }

  if (email && email !== user.email) {
    changesFound = true;
    user
      .updateEmail(email)
      .then(() => {
        user
          .sendEmailVerification()
          .then(() => {
            alert("We have sent you an email verification link");
          })
          .catch(error => {
            // An error happened.
          });
      })
      .catch(error => {
        alert(error.message);
      });
  }
  if (newPassword && confirmPassword)
    if (newPassword === confirmPassword) {
      changesFound = true;

      user
        .updatePassword(newPassword)
        .then(() => {
          alert("Changed password successfully!");
        })
        .catch(error => {
          alert(error.message);
        });
    } else alert("Passwords are not the same!");

  if (!changesFound) alert("No changes!");
};
