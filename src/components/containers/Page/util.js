export const shouldShowSignedInAsDiv = (activePage, user) => {
  if (
    user &&
    (activePage === "/calendar" ||
      activePage === "/subscribe" ||
      activePage === "/accounts" ||
      activePage === "/dashboard" ||
      activePage === "/social-accounts") &&
    user.signedInAsUser
  ) {
    return true;
  } else return false;
};

export const isUserInPlatform = activePage => {
  if (
    activePage === "/dashboard" ||
    activePage === "/calendar" ||
    activePage === "/subscribe" ||
    activePage === "/strategy" ||
    activePage === "/analytics" ||
    activePage === "/social-accounts" ||
    activePage === "/writers-brief" ||
    activePage.substring(0, 7) === "/manage" ||
    activePage === "/profile" ||
    activePage === "/subscription" ||
    activePage === "/ads"
  )
    return true;
  else return false;
};
