import { ActivationHistory } from "../models/activationHistory.model.js";
import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Return the list of users with a success message
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: users,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching users:", error);

    // Return an error response
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching users.",
      error: error.message,
    });
  }
};






export const activateUser = async (req, res) => {
    console.log("AdminActivation called")
     const { amount,referralCode } = req.body;
   
     // Validation check for amount
     if (!amount || isNaN(amount) || amount <= 0) {
       return res.status(400).json({ success: false, message: 'Invalid recharge amount.' });
     }
   
     try {
       // Find the user by ID
       const user = await User.findOne({referralCode:referralCode});
       if (!user) {
         return res.status(404).json({ success: false, message: 'User not found.' });
       }
   
       // Condition for first recharge
       if (user.rechargeWallet === 0) {
         if (amount < 25 || amount % 25 !== 0) {
           return res.status(400).json({
             success: false,
             message: 'First recharge must be a multiple of 25 and not less than 25.',
           });
         }
       }

       
      
       // Update the recharge wallet amount
       user.isActive = true;
       user.activationDate=new Date();
       user.rechargeWallet = Number(user.rechargeWallet) + Number(amount);
       user.totalInvestment += Number(amount);
       user.bnbKombat += Number(10);
       await user.save();


       let tempUser=user;
       while(tempUser.referredBy){
         let upline = await User.findOne({ referralCode: tempUser.referredBy });
         if (upline) {
           upline.teamBusiness = Number(upline.teamBusiness) + Number(amount);
           await upline.save()
           tempUser = upline;
         }
         }
   
   
       // If user has a referrer, add a bonus to the referrer's earning wallet
       if (user.referredBy) {
         const upline = await User.findOne({ referralCode: user.referredBy }); // Added await here
         if (upline) {
           upline.directBussiness = Number(upline.directBussiness) + Number(amount);
           await upline.save();
   
         
         }
       }
    

       // If user has a referrer, add a bonus to the referrer's earning wallet
      
 
       const newActivation = new ActivationHistory({
         referralCode,
         userId:user._id,
         amount
       });
 
       await newActivation.save();
   
    //    console.log("new-------------------",newRechargeHistory);
       
   
       // Respond with success if recharge is successful
       res.status(200).json({
         success: true,
         message: 'Recharge successful.',
         data: user,
       });
     } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, message: 'Server error during recharge process.' });
     }
   };
   




   export const activationHistory = async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await ActivationHistory.find();
  
      // Return the list of users with a success message
      return res.status(200).json({
        success: true,
        message: "Users fetched successfully.",
        data: users,
      });
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error fetching users:", error);
  
      // Return an error response
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching users.",
        error: error.message,
      });
    }
  };