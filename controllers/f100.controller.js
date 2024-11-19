import { F100 } from "../models/f100Income.model";
import { User } from "../models/user.model";

const f100Eligiblity = async (user) => {
  // Check if the user has an activationDate and it's within the last 7 days
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));

  if (user.activationDate && new Date(user.activationDate) >= sevenDaysAgo) {
    // If directBussiness is 2x the rechargeWallet, set dailyIncome to true
    if (user.directBussiness >= 2 * user.rechargeWallet) {
      user.dailyIncome = true;
      await user.save(); // Save the updated user document
    }
  }
};

export const f100 = async (req, res) => {
  const users = await User.find({ isActive: true , dailyIncome : false});
  for (let user of users) {
    await f100Eligiblity(user); // Call eligibility function for each user
  }
  console.log("Rank evaluation completed for all users.");
  res.status(200).send("Test successfully completed.");
};






const f100UserDistribution = async (user)=>{
    user.earningWallet = 0.0333*rechargeWallet
    await user.save();

    const newF100IncomeHistory = new F100({
        userId:user._id,
        rechargeWallet:user.rechargeWallet,
        amount
      })
  
      await newF100IncomeHistory.save();
  
}





export const f100Distribute = async (req, res) => {
    const users = await User.find({ isActive: true , dailyIncome : true});
    for (let user of users) {
      await f100UserDistribution(user); // Call eligibility function for each user
    }
    console.log("Rank evaluation completed for all users.");
    res.status(200).send("Test successfully completed.");
  };
  
  
