export const getMetaData = (page, search) => {
  let description = "";
  let keywords = "";
  let title = "";

  if (page === "/") {
    description =
      "Vent online with strangers. VWS is a site where you can make friends and get help on your specific situation all for free. Our site is 100% anonymous.";
    keywords =
      "vent to someone,vent app,I need to vent,anonymous chat,talk to strangers, chat rooms, chat with strangers";
    title = "Vent and Chat Anonymously With Strangers";
  } else if (page === "/account") {
    title = "Account";
  } else if (page === "/avatar") {
    title = "Avatar";
  } else if (page === "/chat-with-strangers") {
    description =
      "Chat anonymously with great strangers. Our site is free of bullies, bots and perverts. Everything is 100% free and no credit card is required.";
    keywords =
      "anonymously chat,random chat,vent chat,chat rooms,chat with strangers";
    title = "Chat With Strangers";
  } else if (page === "/chat") {
    description = "Your inbox.";
    keywords = "";
    title = "Chat";
  } else if (page === "/make-friends") {
    description =
      "Making friends online has never been easier. After filling out your profile we will match you with like minded people! :)";
    keywords = "make friends online,make friends,make friends app";
    title = "Make Friends Online";
  } else if (page === "/people-online") {
    description =
      "The help you have been looking for is here. These are people online right now. Start chatting with real and kind people. ";
    keywords = "";
    title = "Current People Online On Vent With Strangers";
  } else if (page === "/profile" && !search) {
    title = "Profile";
  } else if (page === "/privacy-policy") {
    title = "Privacy Policy";
  } else if (page === "/quote-contest") {
    description =
      "View geel good quotes. We have a daily contest to see who can create the best feel good quote. View past winners and all quotes.";
    keywords = "feel good quotes";
    title = "Feel Good Quote Contest";
  } else if (page === "/recent") {
    title = "Recent Vents";
  } else if (page === "/rewards") {
    description =
      "Earning rewards is lots of fun on Vent With Strangers. View this page to know how far away your milestones are! :)";
    keywords = "";
    title = "Your Rewards";
  } else if (page === "/rules") {
    description =
      "Vent With Strangers is a safe and secure place. Our rules are very easy to follow :) Be nice and you will be totally fine!";
    keywords = "";
    title = "Vent With Strangers Rules";
  } else if (page === "/search") {
    title = "Search";
  } else if (page === "/settings") {
    title = "Notification Settings";
  } else if (page === "/site-info") {
    description =
      "Our site is awesome. You can, chat with strangers, create anonymous vents, create an avatar and more :) Read about it here!";
    keywords = "vent with strangers, chat anonymously, chat online";
    title = "Vent With Strangers Rules Info";
  } else if (page.substring(0, 5) === "/tags") {
    description =
      "Read vents on any of our tags. Vent With Strangers is a safe place where people can talk about their problems and receive positive constructive feedback.";
    keywords = "anxiety,bullying,depression,family,school";
    title = "View Vents Based on Anxiety, Bullying, Depression and More";
  } else if (page === "/trending") {
    title = "Trending Vents";
  } else if (page === "/vent-to-strangers") {
    description =
      "You are not alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you.";
    keywords = "vent to strangers,vent to someone,chat with strangers";
    title = "Vent To Strangers";
  }

  return { description, keywords, title };
};
