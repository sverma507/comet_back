import { User } from "../models/user.model.js";



export const withdrawl = async (req, res) => {
    try {
      const userId = req.params.Id; // User ID of the withdrawing user
      const totalAmount = req.body.amount; // Total amount requested for withdrawal
  
      // Calculate withdrawal splits
      const withdrawlAmount = totalAmount * 0.5; // 50% to the user's earningWallet
      const directTeamAmount = totalAmount * 0.25; // 25% for directTeam distribution
      const activeUsersAmount = totalAmount * 0.25; // 25% for all active users
  
      // Find the withdrawing user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update the user's earningWallet with 50% of the withdrawal amount
      user.earningWallet += withdrawlAmount;
      await user.save();
  
      // Distribute 25% among the direct team
      if (user.directTeam && user.directTeam.length > 0) {
        const directTeamShare = directTeamAmount / user.directTeam.length; // Split equally among direct team members
        for (let directUserId of user.directTeam) {
          const directUser = await User.findById(directUserId);
          if (directUser) {
            directUser.earningWallet += directTeamShare; // Add the share to their earningWallet
            await directUser.save();
          }
        }
      }
  
      // Distribute 25% among all active users
      const activeUsers = await User.find({ isActive: true });
      if (activeUsers.length > 0) {
        const activeUserShare = activeUsersAmount / activeUsers.length; // Split equally among active users
        for (let activeUser of activeUsers) {
          activeUser.earningWallet += activeUserShare; // Add the share to their earningWallet
          await activeUser.save();
        }
      }
  
      console.log("Withdrawal and distribution completed successfully.");
      res.status(200).json({ message: "Withdrawal processed successfully." });
    } catch (error) {
      console.error("Error during withdrawal process:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };