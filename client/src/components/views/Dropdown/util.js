export const isActiveItem = (activeItem, index) => {
  if (activeItem.constructor === Array) {
    if (activeItem.find(i => i === index) === undefined) return "";
    else return "bg-light-grey five-blue";
  } else {
    if (activeItem === index) return "bg-light-grey five-blue";
    else return "";
  }
};
