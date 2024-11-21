import mongoose from "mongoose";

const backAmountIncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming 'User' is the name of your user model
    required: true
  },
  rechargeWallet:{
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, { timestamps: true }); // This will automatically add `createdAt` and `updatedAt` fields

export const BackAmount = mongoose.model('BackAmount', backAmountIncomeSchema);
