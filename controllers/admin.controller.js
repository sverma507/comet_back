import { ActivationHistory } from "../models/activationHistory.model.js";
import { AdminCrediential } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { WithdrawlWallet } from "../models/withdrawl.js";
import { UplineIncome } from "../models/uplineIncome.js";
import { GlobalIncome } from "../models/globalIncome.js";
// import { withdrawl } from "./withdrawl.controller.js";




export const adminLogin = async (req, res) => {

  try {
      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(401).json({
              message: "Something is missing, please check!",
              success: false,
          });
      }
      let user = await AdminCrediential.findOne({ email });
      if (!user) {
          return res.status(401).json({
              message: "Incorrect email or password",
              success: false,
          });
      }
      // const isPasswordMatch = await bcrypt.compare(password, user.password);
      const isPasswordMatch = password === user.password ?true : false
      if (!isPasswordMatch) {
          return res.status(401).json({
              message: "Incorrect email or password",
              success: false,
          });
      };
      
      const token =  jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '10d' });
      
      console.log("login token==>",token)
      // populate each post if in the posts array
  
      user = {_id: user._id,email: user.email,token}

      console.log("before token set login token ==>",token)

      return res.cookie('token', token, {
          httpOnly: true,  
          sameSite: 'strict',  // Default behavior
          // secure: false, 
          maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
          message: `Welcome back ${user.username}`,
          success: true,
          user
          
      });

  } catch (error) {
      console.log(error);
  }
};




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
      //  user.teamBusiness = Number(user.teamBusiness) + Number(amount);
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
         activatedBy: "Admin", 
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
   

   export const getUserActivationHistory = async(req,res) =>{
    try {
      const {userId} = req.params;
      console.log("idddddddddddddddddd",userId);
      
      const history = await ActivationHistory.find({userId:userId}).sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        message: 'History fetched.',
        data: history,
      });
      console.log("hst=========================>",history);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error during fetching history.' });
    }
  }


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









  export const getInvestorAllWithdrawlHistory = async(req,res) => {
    try {
      // const userId = req.params.userId;
      // const user = await User.findById(userId);
      const history = await WithdrawlWallet.find();
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




  export const getAllRechargeHistory = async (req, res) => {
    try {
  
      // Fetch magic income history for the user
      const history = await ActivationHistory.find().sort({ createdAt: -1 });
  
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



 const withdrawl = async (userId,totalAmount) => {
    try {
      // console.log('==========================>',{userId,totalAmount});
      
      // Calculate withdrawal splits
      const withdrawlAmount = totalAmount * 0.5; // 50% to the user's earningWallet 
      const directTeamAmount = totalAmount * 0.25; // 25% for directTeam distribution
      const activeUsersAmount = totalAmount * 0.25; // 25% for all active users
  
      // Find the withdrawing user
      const user = await User.findById(userId);
      // console.log('userrrrrrrrrrrrrrrrrrrrrr',user);

      if (!user) {
        return "User not found" ;
      }
  
      // Update the user's earningWallet with 50% of the withdrawal amount
      // user.earningWallet -= withdrawlAmount;
      // await user.save();

      // const newWithdrawl = new WithdrawlWallet({
      //   userId: user.referralCode,
      //   walletAddress : user.walletAddress,
      //   amount: totalAmount,
      //   status:'Pending'
      // })

      // await newWithdrawl.save(); 
  
      // Distribute 25% among the direct team
      if (user.directTeam && user.directTeam.length > 0) {
        // console.log('helllllllllllll');
        
        const directTeamShare = directTeamAmount / user.directTeam.length; // Split equally among direct team members
        for (let directUserId of user.directTeam) {
          const directUser = await User.findById(directUserId);
          if (directUser) {
            directUser.earningWallet += directTeamShare; // Add the share to their earningWallet
            directUser.totalEarning += directTeamShare; // Add the share to their earningWallet
            await directUser.save();

            console.log('directUser profit');
            

            const newUplineIncome = new UplineIncome({
              userId: directUser._id,
              from : user.referralCode,
              amount: directTeamShare,
              withdrawl: totalAmount
            })
      
            await newUplineIncome.save(); 

          }
        }
      }
  
      // Distribute 25% among all active users
      const activeUsers = await User.find({ isActive: true });
      if (activeUsers.length > 0) {
        const activeUserShare = activeUsersAmount / activeUsers.length; // Split equally among active users
        for (let activeUser of activeUsers) {

          // console.log("------------===========>",activeUser.referralCode, user.referralCode);
          
          if(activeUser.referralCode !== user.referralCode){
            activeUser.earningWallet += activeUserShare; // Add the share to their earningWallet
            activeUser.totalEarning += activeUserShare; // Add the share to their earningWallet
          await activeUser.save();

          const newGlobalIncome = new GlobalIncome({
            userId: activeUser._id,
            from : user.referralCode,
            amount: activeUserShare,
            withdrawl: totalAmount
          })
    
          await newGlobalIncome.save(); 
          }
          

        }
      }
  
      console.log("Withdrawal and distribution completed successfully.");
      // res.status(200).json({ message: "Withdrawal processed successfully." });
    } catch (error) {
      console.error("Error during withdrawal process:", error);
      // res.status(500).json({ message: "Internal server error." });
    }
  };







  export const updateWithdrawlTransactionStatus = async (req, res) => {
    const { transactionId, status } = req.body;
    // console.log("......",{transactionId, status});
    
  
    try {
        // Find the transaction by ID and update its status
        const transaction = await WithdrawlWallet.findById(transactionId);
        const userS = await User.findOne({referralCode:transaction.userId});
        // console.log('----------------------->',userS._id);
        
  
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if(status === "Approved"){
        // console.log('=======================>',userS._id);
          await withdrawl(userS._id, transaction.amount);
        }else{
          userS.earningWallet += Number(transaction.amount);
          await userS.save();
        }
  
        // Update the status of the transaction
        transaction.status = status;
        await transaction.save();
  
        return res.status(200).json({ message: 'Transaction status updated successfully', transaction });
    } catch (error) {
        console.error('Error updating transaction status:', error);
        return res.status(500).json({ message: 'Failed to update transaction status' });
    }
  };