import { MagicIncome } from "../models/magicIncome.js";
import { User } from "../models/user.model.js";


const magicIncomeDistribution = async (user) => {
    try {
      // Fetch direct users of the current user
      const directUsers = await User.find({ _id: { $in: user.directTeam } });
  
      // Sort direct users by teamBusiness in descending order
      directUsers.sort((a, b) => b.teamBusiness - a.teamBusiness);
  
      // Define percentage brackets
      const percentages = [0, 5, 10, 15]; // First 4 percentages
      const remainingPercentage = 20; // For remaining users after the first 4
  
      // Loop through the sorted direct users
      directUsers.forEach(async(directUser, index) => {
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
        // totalMagicIncome += incomeFromDirectUser;
        user.earningWallet += incomeFromDirectUser;
        await user.save(); // Save the updated user document

         const newMagicIncomeHistory = new MagicIncome({
           userId:user._id,
           from: directUser.referralCode,
           business : directUser.teamBusiness,
           amount : incomeFromDirectUser
      })
         await newMagicIncomeHistory.save();
  
      });
    } catch (error) {
      console.error("Error in magicIncomeDistribution:", error);
    }
  };
  

  export const getAllMagicIncomeHistory = async(req,res) =>{
    try {
      const {userId} = req.params;
      const history = await MagicIncome.findById(userId).sort({ createdAt: -1 });
  
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
  