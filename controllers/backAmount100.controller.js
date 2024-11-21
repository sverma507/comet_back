import { BackAmount } from "../models/backAmount.js";
import { User } from "../models/user.model.js";

// Function to check eligibility for backAmount100Percent and calculate the achieved percentage
const backAmount100Eligiblity = async (user) => {
  // Loop through each direct team member to check the condition
  for (let directUserId of user.directTeam) {
    const directUser = await User.findById(directUserId);

    // Check if directBussiness is at least 2x of rechargeWallet
    if (directUser.directBussiness < 2 * directUser.rechargeWallet) {
      return; // If any direct team member doesn't meet the condition, exit the function
    }
  }

  // Calculate the number of days since activation
  const currentDate = new Date();
  const activationDate = new Date(user.activationDate);
  const timeDiff = currentDate - activationDate; // Time difference in milliseconds
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

  let backAmountAchievedPercent = 20; // Default value if more than 90 days

  // Set the backAmountAchievedPercent based on the number of days since activation
  if (daysDiff <= 30) {
    backAmountAchievedPercent = 100; // Within 30 days
  } else if (daysDiff <= 60) {
    backAmountAchievedPercent = 40; // Within 60 days
  } else if (daysDiff <= 90) {
    backAmountAchievedPercent = 30; // Within 90 days
  }

  // Set the backAmountAchievedPercent and backAmount100Percent if conditions are met
  user.backAmountAchievedPercent = backAmountAchievedPercent;
  user.backAmount100Percent = backAmountAchievedPercent === 100; // Set backAmount100Percent to true if it's 100%

  await user.save(); // Save the updated user document


};

// Function to handle the backAmount100 logic
export const backAmount100 = async (req, res) => {
  // Fetch users who are active and have dailyIncome set to true
  const users = await User.find({ isActive: true, dailyIncome: true });

  // Loop through each user and check eligibility for backAmount100Percent
  for (let user of users) {
    await backAmount100Eligiblity(user); // Call eligibility function for each user
  }

  console.log("Rank evaluation completed for all users.");
  res.status(200).send("Test successfully completed.");
};





// import { User } from "../models/user.model";

// Function to distribute backAmount100 across 100 days
const backAmount100UserDistribution = async (user) => {
  // Check if the user has backAmount100Percent as true
  if (!user.backAmount100Percent) {
    return; // Exit if the user is not eligible
  }

if(user.backAmountReceivedPercent<=100){
      

  // Calculate the amount to be distributed
  const backAmountToDistribute = (user.rechargeWallet * user.backAmountAchievedPercent) / 100;

  // Calculate the daily amount to be distributed over 100 days
  const dailyDistributionAmount = backAmountToDistribute / 100;

  // Update the user's earningWallet
  user.earningWallet += dailyDistributionAmount;
  user.backAmountReceivedPercent += 1;
  // Save the updated user document
  await user.save();
  
  const newBackAmountIncomeHistory = new BackAmount({
    userId : user._id,
    rechargeWallet : user.rechargeWallet,
    amount : dailyDistributionAmount
  }) 

  await newBackAmountIncomeHistory.save();

}else{

    user.backAmount100Percent = false;
    user.backAmountReceivedPercent = 0,
    user.backAmountAchievedPercent = 0,
    await user.save();
}
};


// get all back amount history

export const getAllBackAmountHistory = async(req,res) =>{
  try {
    const {userId} = req.params;
    const history = await BackAmount.findById(userId).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'History fetched.',
      data: history,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during fetching history.' });
  }
}



// Function to handle the backAmount100 distribution logic
export const backAmount100Distribution = async (req, res) => {
  // Fetch users who are active, have dailyIncome set to true, and backAmount100Percent is true
  const users = await User.find({ isActive: true, dailyIncome: true, backAmount100Percent: true });

  // Loop through each user and distribute the amount
  for (let user of users) {
    await backAmount100UserDistribution(user); // Call distribution function for each user
  }

  console.log("Back amount distribution completed for all users.");
  res.status(200).send("Back amount distribution successfully completed.");
};
