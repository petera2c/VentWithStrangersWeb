import db from "../../../config/firebase";

export const getActiveSection = activeSection => {
  if (activeSection === 0) return "topType";
  else if (activeSection === 1) return "accessoriesType";
  else if (activeSection === 2) return "hairColor";
  else if (activeSection === 3) return "facialHairType";
  else if (activeSection === 4) return "clotheType";
  else if (activeSection === 5) return "eyeType";
  else if (activeSection === 6) return "eyebrowType";
  else if (activeSection === 7) return "mouthType";
  else if (activeSection === 8) return "skinColor";
};

export const saveAvatar = async (avatar, userID) => {
  await db
    .collection("users_display_name")
    .doc(userID)
    .set({ avatar }, { merge: true });

  alert("Avatar saved!");
};

export const topArray = [
  "NoHair",
  "Eyepatch",
  "Hat",
  "Hijab",
  "Turban",
  "WinterHat1",
  "WinterHat2",
  "WinterHat3",
  "WinterHat4",
  "LongHairBigHair",
  "LongHairBob",
  "LongHairBun",
  "LongHairCurly",
  "LongHairCurvy",
  "LongHairDreads",
  "LongHairFrida",
  "LongHairFro",
  "LongHairFroBand",
  "LongHairNotTooLong",
  "LongHairShavedSides",
  "LongHairMiaWallace",
  "LongHairStraight",
  "LongHairStraight2",
  "LongHairStraightStrand",
  "ShortHairDreads01",
  "ShortHairDreads02",
  "ShortHairFrizzle",
  "ShortHairShaggyMullet",
  "ShortHairShortCurly",
  "ShortHairShortFlat",
  "ShortHairShortRound",
  "ShortHairShortWaved",
  "ShortHairSides",
  "ShortHairTheCaesar",
  "ShortHairTheCaesarSidePart"
];

export const accessoriesArray = [
  "Blank",
  "Kurt",
  "Prescription01",
  "Prescription02",
  "Round",
  "Sunglasses",
  "Wayfarers"
];
export const hairColorArray = [
  "Auburn",
  "Black",
  "Blonde",
  "BlondeGolden",
  "Brown",
  "BrownDark",
  "PastelPink",
  "Blue",
  "Platinum",
  "Red",
  "SilverGray"
];
export const facialHairArray = [
  "Blank",
  "BeardMedium",
  "BeardLight",
  "BeardMajestic",
  "MoustacheFancy",
  "MoustacheMagnum"
];
export const clothesArray = [
  "BlazerShirt",
  "BlazerSweater",
  "CollarSweater",
  "GraphicShirt",
  "Hoodie",
  "Overall",
  "ShirtCrewNeck",
  "ShirtScoopNeck",
  "ShirtVNeck"
];
export const eyesArray = [
  "Close",
  "Cry",
  "Default",
  "Dizzy",
  "EyeRoll",
  "Happy",
  "Hearts",
  "Side",
  "Squint",
  "Surprised",
  "Wink",
  "WinkWacky"
];
export const eyebrowArray = [
  "Angry",
  "AngryNatural",
  "Default",
  "DefaultNatural",
  "FlatNatural",
  "RaisedExcited",
  "RaisedExcitedNatural",
  "SadConcerned",
  "SadConcernedNatural",
  "UnibrowNatural",
  "UpDown",
  "UpDownNatural"
];
export const mouthArray = [
  "Concerned",
  "Default",
  "Disbelief",
  "Eating",
  "Grimace",
  "Sad",
  "ScreamOpen",
  "Serious",
  "Smile",
  "Tongue",
  "Twinkle",
  "Vomit"
];
export const skinArray = [
  "Tanned",
  "Yellow",
  "Pale",
  "Light",
  "Brown",
  "DarkBrown",
  "Black"
];
