export const searchVents = (
  handleChange,
  oldVents,
  searchPostString,
  skip,
  socket
) => {
  socket.emit("search_problems", { searchPostString, skip }, vents => {
    let newVents = vents;
    let canLoadMore = true;

    if (skip && oldVents) newVents = oldVents.concat(newVents);

    if (newVents && newVents.length < 10) canLoadMore = false;

    handleChange({ canLoadMore, vents: newVents });
  });
};
