export const newNotificationCounter = notifications => {
  let counter = 0;

  for (let index in notifications) {
    if (!notifications[index].hasSeen) counter++;
  }

  if (!counter) return false;
  else return counter;
};
