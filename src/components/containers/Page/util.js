export const getMetaData = (page) => {
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
    keywords = "anonymously chat,random chat,vent chat,chat rooms";
    title = "Chat With Strangers";
  } else if (page === "/chat") {
    description = "Your inbox.";
    keywords = "";
    title = "Chat";
  } else if (page === "/make-friends") {
    description =
      "Making friends online has never been easier. After filling out your profile we will match you with like minded people! :)";
    keywords = "make friends online,make friends,make friends app";
    title = "Make Friends";
  } else if (page === "/people-online") {
    description =
      "The help you have been looking for is here. These are people online right now. Start chatting with real and kind people. ";
    keywords = "";
    title = "People Online";
  } else if (page === "/profile") {
    title = "Profile";
  } else if (page === "/privacy-policy") {
    title = "Privacy Policy";
  } else if (page === "/recent") {
    title = "Recent Vents";
  } else if (page === "/rewards") {
    description =
      "You can earn rewards on Vent With Strangers. Interact and help people to gain Karma Points :)";
    keywords = "";
    title = "Your Rewards";
  } else if (page === "/rules") {
    description =
      "Our rules are very easy to follow :) Be nice and you will be totally fine!";
    keywords = "";
    title = "VWS Rules";
  } else if (page === "/search") {
    title = "Search";
  } else if (page === "/settings") {
    title = "Notification Settings";
  } else if (page === "/site-info") {
    description = "Read about how our website works.";
    keywords = "vent with strangers";
    title = "VWS Info";
  } else if (page === "/trending") {
    title = "Trending Vents";
  } else if (page === "/vent-to-strangers") {
    description =
      "Vent to strangers. You aren’t alone, and you should never feel alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you.";
    keywords = "vent to strangers,vent to someone,chat with strangers";
    title = "Vent To Strangers";
  }

  return { description2: description, keywords2: keywords, title2: title };
};
