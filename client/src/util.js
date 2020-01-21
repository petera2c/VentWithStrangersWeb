// Taken from stack overflow
export function capitolizeWordsInString(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}
export function capitolizeFirstChar(string) {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  else return;
}

export const addTagsToPage = (props, selectedTags) => {
  const { browser, history, location } = props;
  let searchPathname = location.pathname;

  for (let index in selectedTags) {
    if (index == 0) searchPathname += "?" + selectedTags[index].name;
    else searchPathname += "+" + selectedTags[index].name;
  }
  history.push(searchPathname);
};

export const isMobileOrTablet = () => window.screen.width > 940;

export const isPageActive = (page, pathname) => {
  if (page === pathname) return " active ";
  else return "";
};
