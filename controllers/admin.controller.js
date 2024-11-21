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
