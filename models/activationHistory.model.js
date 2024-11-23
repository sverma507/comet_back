import mongoose from "mongoose";

const activationHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming 'User' is the name of your user model
    required: true
  },
  referralCode:{
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  activatedBy : {
    type: String,
    required: true
  }
}, { timestamps: true }); // This will automatically add `createdAt` and `updatedAt` fields

export const ActivationHistory = mongoose.model('ActivationHistory', activationHistorySchema);
