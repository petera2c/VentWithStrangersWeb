export const getMetaInformation = (pathname) => {
  let metaTitle = "";
  let metaDescription =
    "People care. Vent and chat anonymously to be apart of a community committed to making the world a better place.";

  if (pathname === "/popular") {
    metaTitle = "Popular";
    metaDescription =
      "Vents and issues that have the most upvotes and comments of all time. Post, comment, and/or like anonymously.";
  } else if (pathname === "/recent") {
    metaTitle = "Recent";
    metaDescription =
      "The latest vents and issues people have posted. Post, comment, and/or like anonymously.";
  } else if (pathname === "/trending") {
    metaTitle = "Trending";
    metaDescription =
      "People’s vents and issues with the most upvotes in the past 24 hours. Post, comment, and/or like anonymously.";
  } else {
    metaTitle = "Recent";
    metaDescription =
      "The latest vents and issues people have posted. Post, comment, and/or like anonymously.";
  }
  return { metaDescription, metaTitle };
};
