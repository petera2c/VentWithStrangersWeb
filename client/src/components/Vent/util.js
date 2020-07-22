export const commentVent = (addComment, commentString, context, ventID) => {
  context.socket.emit(
    "comment_problem",
    { commentString, ventID },
    (returnObj) => {
      const { comment, message, success } = returnObj;
      if (success) {
      } else context.notify({ message, type: "danger" });
    }
  );
};

export const commentLikeUpdate = (
  comments,
  context,
  dataObj,
  updateCommentLikes
) => {
  const { comment } = dataObj;

  if (!context.comments) {
    if (comments) {
      const commentIndex = comments.findIndex(
        (commentObj) => commentObj._id === comment._id
      );
      updateCommentLikes(commentIndex, dataObj);
    }
  } else {
    const { comments } = this.context;
    const { handleChange } = this.context;

    const commentIndex = comments.findIndex(
      (commentObj) => commentObj._id === comment._id
    );

    let comment2 = comments[commentIndex];

    comment2.upVotes = comment.upVotes;
    if (comment.hasLiked !== undefined) comment2.hasLiked = comment.hasLiked;

    handleChange({ comments });
  }
};

export const deleteVent = (
  history,
  isOnSingleVentPage,
  removeVent,
  socket,
  ventID,
  ventIndex
) => {
  socket.emit("delete_vent", { ventID }, (returnObj) => {
    const { message, success } = returnObj;

    if (success) {
      alert("Vent deleted successfully");

      if (removeVent && Number.isInteger(ventIndex) && !isOnSingleVentPage) {
        removeVent(ventIndex);
      } else {
        history.push("/");
      }
    } else alert(message);
  });
};
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
      (resultObj) => {
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

export const getCurrentTypingIndex = (element) => {
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

export const getVentComments = (context, handleChange, vent) => {
  context.socket.emit("get_problem_comments", vent._id, (returnObj) => {
    const { comments, message, success } = returnObj;

    if (success) handleChange({ comments });
    else context.notify({ message, type: "danger" });
  });
};

export const likeVent = (context, vent, updateVentLikes) => {
  context.socket.emit("like_problem", vent._id, (returnObj) => {
    const { message, success } = returnObj;

    if (success) {
      //updateVentLikes(returnObj);
    } else {
      context.notify({
        message,
        type: "danger",
      });
    }
  });
};

export const reportVent = (
  context,
  history,
  id,
  option,
  pathname,
  ventIndex
) => {
  context.socket.emit(
    "report_problem",
    { option, problemID: id },
    (returnObj) => {
      const { message, success } = returnObj;

      if (success && pathname.substring(0, 9) === "/problem/")
        history.push("/trending/reported");
      else if (success) context.removeVent(ventIndex);
      else
        context.notify({
          message,
          type: "danger",
        });
    }
  );
};

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
    id: user._id,
  };

  taggedUsers.push(taggedUser);

  return callback({
    commentString,
    possibleUsersToTag: undefined,
    taggedUsers,
  });
};

export const unlikeVent = (context, vent, updateVentLikes) => {
  context.socket.emit("unlike_problem", vent._id, (returnObj) => {
    const { message, success } = returnObj;

    if (success) {
    } else {
      context.notify({
        message,
        type: "danger",
      });
    }
  });
};
