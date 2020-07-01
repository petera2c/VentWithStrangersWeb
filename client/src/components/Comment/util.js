export const likeComment = (
  context,
  comment,
  commentIndex,
  updateCommentLikes
) => {
  context.socket.emit("like_comment", { commentID: comment._id }, returnObj => {
    const { message, success } = returnObj;

    if (success && updateCommentLikes) {
      updateCommentLikes(commentIndex, returnObj);
    } else {
      context.notify({
        message,
        type: "danger"
      });
    }
  });
};

export const swapTags = text => {
  //  @{{[[[__id__]]]||[[[__display__]]]}}
  //const test = "\u03A9";

  const regexFull = /@\{\{\[\[\[[\x21-\x5A|\x61-\x7A]+\]\]\]\|\|\[\[\[[\x21-\x5A|\x61-\x7A|\x5f]+\]\]\]\}\}/gi;
  const regexID = /(?<=@\{\{\[\[\[)[\x21-\x5A|\x61-\x7A]+(?=\]\]\]\|\|)/gi;
  const regexDisplay = /(?<=\|\|\[\[\[)[\x21-\x5A|\x61-\x7A]+(?=\]\]\]\}\})/gi;
  const tags = text.match(regexFull) || [];

  const test = text.replace(regexFull, possibleTag => {
    const displayNameArray = possibleTag.match(regexDisplay);

    if (displayNameArray && displayNameArray[0]) {
      return displayNameArray[0];
    } else return possibleTag;
  });

  return test;
  /*
  tags.map(myTag => {
    const tagWithoutBrackets = myTag.match(3, -2);

    const test = myTag.match(
      /(?<=\|\|\[\[\[)[\x21-\x5A|\x61-\x7A]+(?=\]\]\]\}\})/gi
    );
  });*/

  //return displayText;
};

export const unlikeComment = (
  context,
  comment,
  commentIndex,
  updateCommentLikes
) => {
  context.socket.emit(
    "unlike_comment",
    { commentID: comment._id },
    returnObj => {
      const { message, success } = returnObj;

      if (success && updateCommentLikes) {
        updateCommentLikes(commentIndex, returnObj);
      } else {
        context.notify({
          message,
          type: "danger"
        });
      }
    }
  );
};
