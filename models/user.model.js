import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the referred user
  isActive: { type: Boolean, default: false } // Active status of the referred user
});

const userSchema = new mongoose.Schema({
  dailyIncome:  { type: Boolean, default: false },
  walletAddress: { type: String, required:true},
  rechargeWallet: { type: Number, default: 0 },
  totalInvestment: { type: Number, default: 0 },
  earningWallet: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
  teamBusiness:{type:Number, default: 0},
  teamSize: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referralCode: { type: String, unique: true },
  bnbKombat: { type: Number, default: 0 },
  referredBy: { type: String },
  backAmount100Percent:{ type: Boolean, default: false },
  backAmountReceivedPercent:{ type: Number, default: 0 },
  backAmountAchievedPercent:{ type: Number, default: 0 },
  directIncome: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  directTeam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalEarning: { type: Number, default: 0 },
  directBussiness: { type: Number, default: 0 },
  isBlocked : { type: Boolean, default: false },
  activationDate: { type: Date, default: null }, // Date of the first referral
  referrals: [referralSchema], // Array of referrals with active status
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
