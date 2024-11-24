import mongoose from "mongoose";

const uplineIncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming 'User' is the name of your user model
    required: true
  },
  from:{
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  withdrawl: {
    type: Number,
    required: true
  }
}, { timestamps: true }); // This will automatically add `createdAt` and `updatedAt` fields

export const UplineIncome = mongoose.model('UplineIncome', uplineIncomeSchema);
