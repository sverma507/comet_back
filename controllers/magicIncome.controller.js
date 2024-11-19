import { User } from "../models/user.model";


const magicIncomeDistribution = async (user) => {
    try {
      // Fetch direct users of the current user
      const directUsers = await User.find({ _id: { $in: user.directTeam } });
  
      // Sort direct users by teamBusiness in descending order
      directUsers.sort((a, b) => b.teamBusiness - a.teamBusiness);
  
      // Define percentage brackets
      const percentages = [0, 5, 10, 15]; // First 4 percentages
      const remainingPercentage = 20; // For remaining users after the first 4
  
      let totalMagicIncome = 0;
  
      // Loop through the sorted direct users
      directUsers.forEach((directUser, index) => {
        let percentage;
  
        // Determine the percentage based on the index
        if (index < percentages.length) {
          percentage = percentages[index];
        } else {
          percentage = remainingPercentage;
        }
  
        // Calculate the income from this direct user
        const incomeFromDirectUser = (directUser.teamBusiness * percentage) / 100;
  
        // Add this income to the total magic income
        totalMagicIncome += incomeFromDirectUser;
      });
  
      // Add the calculated magic income to the user's earningWallet
      user.earningWallet += totalMagicIncome;
      await user.save(); // Save the updated user document
    } catch (error) {
      console.error("Error in magicIncomeDistribution:", error);
    }
  };
  


// Function to handle the backAmount100 distribution logic
export const magicIncome = async (req, res) => {
    // Fetch users who are active, have dailyIncome set to true, and backAmount100Percent is true
    const users = await User.find({ isActive: true });
  
    // Loop through each user and distribute the amount
    for (let user of users) {
      await magicIncomeDistribution(user); // Call distribution function for each user
    }
  
    console.log("Back amount distribution completed for all users.");
    res.status(200).send("Back amount distribution successfully completed.");
  };
  