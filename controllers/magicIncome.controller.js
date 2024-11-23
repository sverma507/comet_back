import { MagicIncome } from "../models/magicIncome.js";
import { User } from "../models/user.model.js";

// Function to distribute magic income
const magicIncomeDistribution = async (user) => {
  try {
    // Fetch direct users of the current user
    const directUsers = await User.find({ _id: { $in: user.directTeam } });

    // Sort direct users by teamBusiness in descending order
    // directUsers.sort((a, b) => b.teamBusiness - a.teamBusiness);
    directUsers.sort((a, b) => {
      const valueA = a.teamBusiness + a.rechargeWallet;
      const valueB = b.teamBusiness + b.rechargeWallet;
      return valueB - valueA; // Descending order
  });
  
    // Define percentage brackets
    const percentages = [0, 5, 10, 15]; // First 4 percentages
    const remainingPercentage = 20; // For remaining users after the first 4

    // Loop through the sorted direct users
    for (const [index, directUser] of directUsers.entries()) {
      let percentage;

      // Determine the percentage based on the index
      if (index < percentages.length) {
        percentage = percentages[index];
      } else {
        percentage = remainingPercentage;
      }

      // Calculate the income from this direct user
      const incomeFromDirectUser = ((directUser.teamBusiness+directUser.rechargeWallet) * percentage) / 100;

      // Add this income to the user's earning wallet
      user.earningWallet += incomeFromDirectUser;

      // Save the updated user document
      await user.save();

      // Save magic income history
      const newMagicIncomeHistory = new MagicIncome({
        userId: user._id,
        from: directUser.referralCode,
        business: directUser.teamBusiness,
        amount: incomeFromDirectUser,
      });
      await newMagicIncomeHistory.save();
    }
  } catch (error) {
    console.error("Error in magicIncomeDistribution:", error);
  }
};

// API endpoint to fetch all magic income history for a user
export const getAllMagicIncomeHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch magic income history for the user
    const history = await MagicIncome.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "History fetched.",
      data: history,
    });
  } catch (error) {
    console.error("Error fetching magic income history:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during fetching history." });
  }
};

// Function to handle the magic income distribution logic
export const magicIncome = async (req, res) => {
  try {
    // Fetch users who are active
    const users = await User.find({ isActive: true });

    // Loop through each user and distribute the income
    for (const user of users) {
      await magicIncomeDistribution(user); // Call distribution function for each user
    }

    console.log("Magic income distribution completed for all users.");
    res.status(200).send("Magic income distribution successfully completed.");
  } catch (error) {
    console.error("Error in magicIncome:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during income distribution." });
  }
};
