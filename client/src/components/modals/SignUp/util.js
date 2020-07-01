export const getInvalidCharacters = displayName => {
  const invalidCharactersArray = displayName.split(/[\x21-\x5A|\x61-\x7A]+/gi);
  let invalidCharacters = "";

  for (let index in invalidCharactersArray) {
    invalidCharacters += invalidCharactersArray[index];
  }
  return invalidCharacters;
};

export const validateEmail = () => {
  return true;
};
