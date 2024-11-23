import { ActivationHistory } from "../models/activationHistory.model.js";
import { LevelIncome } from "../models/levelIncome.js";
import { User } from "../models/user.model.js";
import { UserRecharge } from "../models/userRecharge.model.js";
import jwt from 'jsonwebtoken'
export const InvesterSignUp = async (req, res) => {
    const {referredBy, walletAddress } = req.body;
    const gift = 10
    try {
      // // Check if the phone number already exists in the database
      const existingWallet = await User.findOne({ walletAddress });
      if (existingWallet) {
        return res
          .status(400)
          .json({ message: "Wallet Address  already exists." });
      }

      // 1. Check if this is the first user (no users in the system)
      const userCount = await User.countDocuments();
    
      if (userCount === 0) {
        console.log("wallet inside if ===>", req.body.walletAddress);
  
        // If this is the first user, no need for referredBy or preferredSide
        const newUser = new User({
          bnbKombat:gift,
          walletAddress,
          referralCode: generateReferralCode(),
          // referralCode: walletAddress,
        });
  
        await newUser.save();
        return res
          .status(201)
          .json({ message: "First user successfully created!", User: newUser });
      }
  
      let parentUser;
  
      // 2. If referredBy is provided, find the parent by referral code
      if (referredBy) {
        parentUser = await User.findOne({ referralCode: referredBy });
        if (!parentUser) {
          return res.status(400).json({ message: "Invalid referral code." });
        } 
      }
  

      const newUser = new User({
        bnbKombat:gift,
        referralCode: generateReferralCode(),
        referredBy: parentUser.referralCode,
        walletAddress,
      });
  
      await newUser.save();
  
      const temp = await User.findOne({ walletAddress })
      parentUser.referrals.push({ userId: temp._id, registrationDate: new Date() });
      console.log("signup user", newUser)
      if (!parentUser.directTeam.includes(newUser._id)) {
        // Add new user ID to the directTeam array
        parentUser.directTeam.push(newUser._id);
        parentUser.directIncome +=10;
        parentUser.bnbKombat +=10;

        const newLevelIncomeHistory = new LevelIncome({
          userId:parentUser._id,
          from: newUser.referralCode,
          level : 1,
          amount : 10
     })
        await newLevelIncomeHistory.save();
        // Save the updated parent user document
        await parentUser.save();

       

        console.log(`New user added to directTeam of parent user with ID: ${parentUser}`);
      } else {
        console.log("User is already a member of the direct team.");
      }
      await parentUser.save();
      console.log("newUSER===>",newUser)
      let tempUser=newUser;
      let tlevel=1;
      while(tempUser.referredBy){
        const upline = await User.findOne({ referralCode: tempUser.referredBy });
        if (upline) {
          // upline.teamSize = Number(upline.teamSize) + 1;
          upline.teamSize.push({userId: newUser._id, level:tlevel});
          if(tlevel>=2&&tlevel<=11){
            upline.directIncome += 1;
            upline.bnbKombat += 1;

            const newLevelUplineIncomeHistory = new LevelIncome({
              userId:upline._id,
              from: newUser.referralCode,
              level : tlevel,
              amount : 1
         })
            await newLevelUplineIncomeHistory.save();
          }

          await upline.save()
          tempUser = upline;
          tlevel +=1;
        }
      }
      // 10. Respond with success
      return res
        .status(201)
        .json({ message: "User successfully created!", User: newUser });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
};
  
  
  const generateReferralCode = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
    return `BKT${randomNumber}`;
  };




  export const getAllLevelIncomeHistory = async(req,res) =>{
    try {
      const {userId} = req.params;
      const history = await LevelIncome.find({userId:userId}).sort({ createdAt: -1 });
  
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





  export const userRecharge = async(req,res) =>{
    console.log("userActivation called")
    const { referralCode , amount } = req.params;
    const {deductbnbKombat} = req.body;
  
    // Validation check for amount
    // if (!amount || isNaN(amount) || amount <= 0) {
    //   return res.status(400).json({ success: false, message: 'Invalid recharge amount.' });
    // }
  
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
      user.bnbKombat -=deductbnbKombat
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
        activatedBy: "User", 
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
  }
  
  
  
  export const getUserRechargeHistory = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Fetch magic income history for the user
      const history = await ActivationHistory.find({ userId }).sort({ createdAt: -1 });
  
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




  
  export const Investerlogin = async (req, res) => {
    console.log("Login request data:", req.body);
  
    try {
      const { walletAddress } = req.body;
  
      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Wallet address is required.',
        });
      }
  
      // Find user by wallet address
      const user = await User.findOne({ walletAddress });
  
      console.log(user)
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'User not found. Please register.',
        });
      }
  
      // if (user.blocked) {
      //   return res.status(400).json({
      //     success: false,
      //     message: 'You are blocked by the admin. Contact admin for assistance.',
      //   });
      // }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '10d' });
  
  

      return res.status(200).json({
        success: true,
        message: 'Login successful!',
        user,
        token,
      });
      
  
  
    } catch (err) {
      console.log("Login error:", err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred during login. Please try again later.',
      });
    }
  };
  






  export const InvesterRecharge = async (req, res) => {
    const userId = req.params.id;
    console.log("Invester recharge called", userId);
    const { amount } = req.body;
  
    // Validation check for amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid recharge amount.' });
    }
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      // Condition for first recharge
      if (!user.isActive) {
        if (amount < 10 || amount % 10 !== 0) {
          return res.status(400).json({
            success: false,
            message: 'First recharge must be a multiple of 10 and not less than 10.',
          });
        }
      }
  
      if (!user.isActive) {
        user.isActive = true;
        user.activationDate = new Date(); // Set current date and time
    }
      // Update the recharge wallet amount
      user.rechargeWallet = Number(user.rechargeWallet) + Number(amount);
      user.bnbKombat += Number(amount)
      user.directBussiness = Number(user.directBussiness) + Number(amount);
      await user.save();
  
      const tempUser=user;
          while(tempUser.referredBy){
            const upline = await User.findOne({ referralCode: tempUser.referredBy });
            if (upline) {
              upline.teamBusiness = Number(upline.teamBusiness) + Number(amount);
              await upline.save()
              tempUser = upline;
             }
        }
  
      // If user has a referrer, add a bonus to the referrer's earning wallet
      // if (user.referredBy) {
      //   const upline = await User.findOne({ referralCode: user.referredBy }); // Added await here
      //   if (upline) {
      //     upline.earningWallet = Number(upline.earningWallet) + Number(amount * 0.05);
      //     upline.directBussiness = Number(upline.directBussiness) + Number(amount);
      //     await upline.save();
         
      //    const newRefferalHistory = new DirectReferralIncome({
      //     userId : upline._id,
      //     from: user.referralCode,
      //     amountOf : amount,
      //     amount : Number(amount * 0.05)
      //    })
  
      //    await newRefferalHistory.save();
  
      //    console.log('sdsfgd-------------',newRefferalHistory);
         
      //   }
      // }
  
  
      const newRechargeHistory = new UserRecharge({
        userId,
        status:"success",
        amount
      })
  
      await newRechargeHistory.save();
  
      
  
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













  export const myTeamMembers = async (req, res) => {
    // console.log("hellllllllllllllllllllllooooooooooooo")
    const { id, level } = req.params;
    // console.log("level==>",level)
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Fetch users at the specified level
      const levelUsers = await getUsersAtLevel(user.referralCode, parseInt(level));
      res.status(200).json(levelUsers);
    } catch (err) {
      console.error('Error fetching team members:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Helper function to get users at a specific level
  const getUsersAtLevel = async (referralCode, level) => {
    let currentLevelUsers = [];
    let previousLevelReferralCodes = [referralCode]; // Start with the initial referral code
  
    for (let i = 1; i <= level; i++) {
      if (i === 1) {
        // For level 1, get direct referrals from the user's 'referrals' array
        const user = await User.findOne({ referralCode }).populate('referrals.userId');
        currentLevelUsers = user.referrals
          .map(ref => ref.userId)
          .filter(ref => ref); // Get valid referred users
      } else {
        // For subsequent levels, get referrals of users from the previous level
        console.log("entered")
        currentLevelUsers = await User.find({ referredBy: { $in: previousLevelReferralCodes } });
      }
  
      // Update previousLevelReferralCodes for the next iteration
      previousLevelReferralCodes = currentLevelUsers.map(user => user.referralCode);
      // console.log("previousLevelReferralCodes=>",previousLevelReferralCodes)
      // If we are at the current level, return the users
      if (i === level) {
        return currentLevelUsers;
      }
    }
  
    return [];
  };