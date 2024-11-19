import mongoose from "mongoose";

const f100IncomeSchema = new mongoose.Schema({
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

export const F100 = mongoose.model('F100', f100IncomeSchema);
