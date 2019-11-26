// Taken from stack overflow
export function capitolizeWordsInString(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}
export function capitolizeFirstChar(string) {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  else return;
}
