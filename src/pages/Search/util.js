export const searchVents = (
  handleChange,
  oldVents,
  searchPostString,
  skip,
  socket
) => {
  socket.emit("search_problems", { searchPostString, skip }, vents => {
    let newVents = vents;
    let canLoadMorePosts = true;

    if (skip && oldVents) newVents = oldVents.concat(newVents);

    if (newVents && newVents.length < 10) canLoadMorePosts = false;

    handleChange({ canLoadMorePosts, vents: newVents });
  });
};
