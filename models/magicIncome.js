import mongoose from "mongoose";

const magicIncomeSchema = new mongoose.Schema({
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
  business: {
    type: Number,
    required: true
  }
}, { timestamps: true }); // This will automatically add `createdAt` and `updatedAt` fields

export const MagicIncome = mongoose.model('MagicIncome', magicIncomeSchema);
