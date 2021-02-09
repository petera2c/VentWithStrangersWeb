import firebase from "firebase/app";
import "firebase/database";

export const commentLikeUpdate = (
  comments,
  context,
  dataObj,
  updateCommentLikes
) => {};

export const commentVent = (commentString, user, ventID) => {
  if (!user) return alert("Only users can comment! Please login or register.");
  let commentObj = {
    server_timestamp: {
      ".sv": "timestamp"
    },
    text: commentString,
    userID: user.uid,
    ventID
  };

  const db = firebase.database();
  let commentsRef = db.ref("/comments/" + ventID).push();
  commentsRef
    .set(commentObj)
    .then(() => {
      const postCounterRef = db.ref("vents/" + ventID + "/commentCounter");

      postCounterRef.once("value", snapshot => {
        if (!snapshot) return;

        const value = snapshot.val();

        const valueToUpdateBy = 1;

        if (!value) postCounterRef.set(valueToUpdateBy);
        else postCounterRef.set(value + valueToUpdateBy);
      });
    })
    .catch(error => alert(error.message));
};

export const deleteVent = (
  history,
  isOnSingleVentPage,
  removeVent,
  socket,
  ventID,
  ventIndex
) => {};

export const findPossibleUsersToTag = (
  callback,
  currentTypingWord,
  socket,
  ventID,
  callback2
) => {
  let isTag;

  if (currentTypingWord) {
    socket.emit(
      "find_relevant_users_to_tag",
      { currentTypingTag: currentTypingWord, ventID },
      resultObj => {
        const { users } = resultObj;

        if (users)
          callback2(
            users.map((user, index) => {
              return { id: user._id, display: user.displayName };
            })
          );

        callback({ possibleUsersToTag: users });
      }
    );
  } else {
    callback({ possibleUsersToTag: undefined });
  }
};

export const getCurrentTypingIndex = element => {
  // Taken from stack overflow
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
};

const getCurrentTypingWord = (currentTypingIndex, fullString) => {
  let currentTypingWord = "";
  let distanceToLeft = 0;
  let distanceToRight = 0;

  // Get all chars in word to left of where user is typing
  for (let i = currentTypingIndex - 1; i >= 0; i--) {
    if (fullString[i] === " ") break;
    distanceToLeft++;

    if (currentTypingWord)
      currentTypingWord = fullString[i] + currentTypingWord;
    else currentTypingWord = fullString[i];
  }

  // Get all chars in word to right of where user is typing
  for (let i = currentTypingIndex; i < fullString.length; i++) {
    if (fullString[i] === " ") break;
    distanceToRight++;

    if (currentTypingWord)
      currentTypingWord = currentTypingWord + fullString[i];
    else currentTypingWord = fullString[i];
  }

  return { currentTypingWord, distanceToLeft, distanceToRight };
};

export const getVentDescription = (previewMode, vent) => {
  let description = vent.description;
  if (previewMode && description.length > 240)
    description = description.slice(0, 240) + "... Read More";
  return description;
};

export const getVentFullLink = vent => {
  const partialLink =
    "/problem/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase();
  return "https://www.ventwithstrangers.com" + partialLink;
};

export const getVentPartialLink = vent => {
  return (
    "/problem/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase()
  );
};

export const newVentCommentListener = (setComments, ventID, first = true) => {
  const db = firebase.database();

  const query = db
    .ref("/comments/" + ventID)
    .orderByChild("server_timestamp")
    .limitToLast(1);
  const listener = query.on("value", snapshot => {
    if (!snapshot) return;
    if (first) {
      first = false;
      return;
    }

    const value = snapshot.val();
    const exists = snapshot.exists();

    if (exists) {
      let arrayResult = Object.keys(value).map(commentID => {
        return { id: commentID, ...value[commentID] };
      });

      setComments(oldComments => {
        for (let index in oldComments)
          if (oldComments[index].id === arrayResult[0].id) return oldComments;

        if (oldComments) {
          return [...arrayResult, ...oldComments];
        } else return arrayResult;
      });
    } else setComments([]);
  });

  return () => query.off("value", listener);
};

export const getVentComments = (comments, setComments, ventID) => {
  let endAt = 10000000000000;
  if (comments && comments[comments.length - 1].server_timestamp)
    endAt = comments[comments.length - 1].server_timestamp - 1;

  const db = firebase.database();

  const query = db
    .ref("/comments/" + ventID)
    .orderByChild("server_timestamp")
    .endAt(endAt)
    .limitToLast(10);
  const listener = query.once("value", snapshot => {
    if (!snapshot) return;

    const value = snapshot.val();
    const exists = snapshot.exists();

    if (exists) {
      let newComments = Object.keys(value).map(commentID => {
        return { id: commentID, ...value[commentID] };
      });

      newComments.sort((a, b) => {
        if (a.server_timestamp < b.server_timestamp) return 1;
        else return -1;
      });

      setComments(oldComments => {
        if (oldComments) return [...oldComments, ...newComments];
        else return newComments;
      });
    } else setComments([]);
  });
};

export const ventHasLikedListener = (setHasLiked, userID, ventID) => {
  const db = firebase.database();

  const postLikedRef = db.ref("post_likes/" + ventID + "/" + userID);
  const listener = postLikedRef.on("value", snapshot => {
    if (!snapshot) return;
    const value = snapshot.val();

    setHasLiked(value);
  });

  return () => postLikedRef.off("value", listener);
};

export const ventListener = (setVent, ventID) => {
  const db = firebase.database();

  const ventRef = db.ref("/vents/" + ventID);

  const listener = ventRef.on("value", snapshot => {
    if (!snapshot) return;
    const value = snapshot.val();
    const exists = snapshot.exists();

    if (exists) setVent({ id: snapshot.key, ...value });
    else setVent(false);
  });

  return () => ventRef.off("value", listener);
};

export const likeOrUnlikeVent = (user, vent) => {
  if (!user)
    return alert("You must sign in or register an account to support a vent!");
  const db = firebase.database();

  const postLikedRef = db.ref("post_likes/" + vent.id + "/" + user.uid);
  const postCounterRef = db.ref("vents/" + vent.id + "/likeCounter");

  postLikedRef.once("value", snapshot => {
    if (!snapshot) return;
    const value = snapshot.val();
    const exists = snapshot.exists();

    postCounterRef.once("value", snapshot => {
      if (!snapshot) return;

      const value2 = snapshot.val();
      const exists = snapshot.exists();

      let valueToUpdateBy = 1;

      if (value) valueToUpdateBy = -1;

      if (!value2) postCounterRef.set(1);
      else postCounterRef.set(value + valueToUpdateBy);
    });

    if (!value) {
      postLikedRef.set(true);
    } else {
      postLikedRef.set(null);
    }
  });
};

export const reportVent = () => {};

export const tagUser = (
  callback,
  commentString,
  currentTypingIndex,
  taggedUsers,
  user
) => {
  if (!callback || !commentString || !currentTypingIndex || !user) return;

  const { distanceToLeft, distanceToRight } = getCurrentTypingWord(
    currentTypingIndex,
    commentString
  );

  let firstBitOfComment = commentString.substring(
    0,
    currentTypingIndex - distanceToLeft
  );
  let secondBitOfComment = commentString.substring(
    currentTypingIndex + distanceToRight,
    commentString.length
  );

  const taggedUser = {
    display: user._id,
    id: user._id
  };

  taggedUsers.push(taggedUser);

  return callback({
    commentString,
    possibleUsersToTag: undefined,
    taggedUsers
  });
};

export const startMessage = (userID, ventUserID) => {
  const db = firebase.database();

  const doesConversationExistRef = db.ref(
    "users/" + userID + "chats/" + ventUserID
  );
  /*
  const superCoolDatabaseModel = {
    user: {
      chats: {
        otherUserFromChatID: chatID,
      },
    },
  };

    if(user.chats.otherUserFromChatID.exists()) then this conversation between these two users works
*/
  doesConversationExistRef.once("value", snapshot => {
    const value = snapshot.val();
    const exists = snapshot.exists();

    if (exists) {
    } else {
    }
  });
};
