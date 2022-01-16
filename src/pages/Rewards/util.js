import db from "../../config/firebase";

export const calculateMilestone = (counter, size) => {
  if (size === "small") {
    if (counter >= 500) return 5000;
    else if (counter >= 250) return 2500;
    else if (counter >= 100) return 1250;
    else if (counter >= 50) return 500;
    else if (counter >= 25) return 250;
    else if (counter >= 10) return 125;
    else if (counter >= 1) return 50;
    else if (counter >= 0) return 5;
  } else if (size === "medium") {
    if (counter >= 5000) return 2500;
    else if (counter >= 2000) return 1000;
    else if (counter >= 1000) return 400;
    else if (counter >= 500) return 200;
    else if (counter >= 250) return 100;
    else if (counter >= 100) return 50;
    else if (counter >= 50) return 20;
    else if (counter >= 10) return 10;
    else if (counter >= 0) return 5;
  }
};
export const getNextMilestone = (counter, size) => {
  if (size === "small") {
    if (counter >= 500) return 1000;
    else if (counter >= 250) return 500;
    else if (counter >= 100) return 250;
    else if (counter >= 50) return 100;
    else if (counter >= 25) return 50;
    else if (counter >= 10) return 25;
    else if (counter >= 1) return 10;
    else if (counter >= 0) return 1;
  } else if (size === "medium") {
    if (counter >= 5000) return 10000;
    else if (counter >= 2000) return 5000;
    else if (counter >= 1000) return 2000;
    else if (counter >= 500) return 1000;
    else if (counter >= 250) return 500;
    else if (counter >= 100) return 250;
    else if (counter >= 50) return 100;
    else if (counter >= 0) return 10;
  }
};

export const getUserRewards = async (isMounted, setData, userID) => {
  const userRewardsDoc = await db.collection("user_rewards").doc(userID).get();

  if (userRewardsDoc.exists && userRewardsDoc.data())
    setData(userRewardsDoc.data());
};
