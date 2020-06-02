export const commentVent = (commentString, context, vent, addComment) => {
  context.socket.emit("comment_problem", commentString, vent._id, returnObj => {
    const { comment, message, success } = returnObj;
    if (success) {
      //addComment({ comment });
    } else context.notify({ message, type: "danger" });
  });
};

export const findPossibleUsersToTag = (
  callback,
  currentTypingIndex,
  commentString,
  socket,
  ventID
) => {
  const reg = /\B\@\w+/g;
  const taggedUserList = commentString.match(reg);

  let currentTypingWord = "";
  let isTag;

  for (let i = currentTypingIndex; i >= 0; i--) {
    if (commentString[i] === " ") break;
    if (currentTypingWord)
      currentTypingWord = commentString[i] + currentTypingWord;
    else currentTypingWord = commentString[i];
  }
  for (let i = currentTypingIndex; i < commentString.length; i++) {
    if (commentString[i] === " ") break;
    if (currentTypingWord)
      currentTypingWord = currentTypingWord + commentString[i];
    else currentTypingWord = commentString[i];
  }
  //  console.log(currentTypingWord);

  if (isTag && currentTypingWord) {
    socket.emit(
      "find_relevant_users_to_tag",
      { currentTypingTag: currentTypingTag.substr(1), ventID },
      resultObj => {
        const { users } = resultObj;
        callback({ possibleUsersToTag: users });
      }
    );
  } else {
    callback({ possibleUsersToTag: [] });
  }
};

export const getVentComments = (context, handleChange, vent) => {
  context.socket.emit("get_problem_comments", vent._id, returnObj => {
    const { comments, message, success } = returnObj;

    if (success) handleChange({ comments });
    else context.notify({ message, type: "danger" });
  });
};
export const likeVent = (context, vent, updateVentLikes) => {
  context.socket.emit("like_problem", vent._id, returnObj => {
    const { message, success } = returnObj;

    if (success) {
      //updateVentLikes(returnObj);
    } else {
      context.notify({
        message,
        type: "danger"
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
    returnObj => {
      const { message, success } = returnObj;

      if (success && pathname.substring(0, 9) === "/problem/")
        history.push("/trending/reported");
      else if (success) context.removeVent(ventIndex);
      else
        context.notify({
          message,
          type: "danger"
        });
    }
  );
};

export const unlikeVent = (context, vent, updateVentLikes) => {
  context.socket.emit("unlike_problem", vent._id, returnObj => {
    const { message, success } = returnObj;

    if (success) {
      //updateVentLikes(returnObj);
    } else {
      context.notify({
        message,
        type: "danger"
      });
    }
  });
};
