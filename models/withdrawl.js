import mongoose from "mongoose";

const withdrawlSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    // required: true
  }
}, { timestamps: true }); // This will automatically add `createdAt` and `updatedAt` fields

export const WithdrawlWallet = mongoose.model('WithdrawlWallet', withdrawlSchema);
