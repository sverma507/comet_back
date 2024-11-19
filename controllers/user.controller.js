import { User } from "../models/user.model.js";
import { UserRecharge } from "../models/userRecharge.model.js";

export const InvesterSignUp = async (req, res) => {
    const { userName, email, phone, referredBy, walletAddress } = req.body;
    const gift = 10
    try {
      // Check if the email already exists in the database
      if (!userName || !email || !phone) {
        return res.status(400).json({ message: "Fill All The Fields" });
      }
  
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "Email Address  already exists." });
      }
  
  
      // const existingPhone = await User.findOne({ phone });
      // if (existingPhone) {
      //   return res.status(400).json({ message: "Phone Number  already exists." });
      // }
  
      // // Check if the phone number already exists in the database
      // const existingWallet = await User.findOne({ walletAddress });
      // if (existingWallet) {
      //   return res
      //     .status(400)
      //     .json({ message: "Wallet Address  already exists." });
      // }
  
      // 1. Check if this is the first user (no users in the system)
      const userCount = await User.countDocuments();
    
      if (userCount === 0) {
        console.log("wallet inside if ===>", req.body.walletAddress);
  
        // If this is the first user, no need for referredBy or preferredSide
        const newUser = new User({
          username: userName,
          email,
          phone,
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
        } else {
  
          await updateCappingForReferrer(parentUser);
  
        }
      }
  
      
      const newUser = new User({
        username: userName,
        email,
        phone,
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
        parentUser.earningWallet +=10;

        // Save the updated parent user document
        await parentUser.save();
        console.log(`New user added to directTeam of parent user with ID: ${parentUser}`);
      } else {
        console.log("User is already a member of the direct team.");
      }
      await parentUser.save();
      console.log("newUSER===>",newUser)
      let tempUser=newUser;
      let tlevel=2;
      while(tempUser.referredBy){
        const upline = await User.findOne({ referralCode: tempUser.referredBy });
        if (upline) {
          // upline.teamSize = Number(upline.teamSize) + 1;
          upline.teamSize.push(newUser._id);
          if(tlevel>=2&&tlevel<=11){
            upline.directIncome +=1;
            upline.earningWallet +=1;
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
    return `DZ${randomNumber}`;
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
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
  
  
      return res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',  // Default behavior
        // secure: false, 
        maxAge: 1 * 24 * 60 * 60 * 1000
      }).json({
        message: `Welcome back ${user.username}`,
        success: true,
        user
  
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





