export const likeProblem = (problemID, socket) => {
  console.log("herer");
  socket.emit("like_problem", problemID, (problem, success) => {
    console.log(problem);
  });
};
