import express from "express";
import { getUserRechargeHistory, getUserWithdrawlHistory, Investerlogin, InvesterSignUp, myTeamMembers, userRecharge, withdrawlWallet} from "../controllers/user.controller.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
import cron from "node-cron";
import { loginMiddleware } from "../middlewares/auth.js";
// import { withdrawl } from "../controllers/withdrawl.controller.js";
const router = express.Router();

router.route('/register').post(InvesterSignUp);
router.route('/login').post(Investerlogin);
router.route('/team-members/:id/:level').get(myTeamMembers);
router.route('/recharge/:referralCode/:amount').post(userRecharge);
router.route('/recharge-history/:userId/').get(getUserRechargeHistory)
router.route('/withdrawl/:userId/:amount').post(withdrawlWallet);
router.route('/withdrawl-history/:userId').get(getUserWithdrawlHistory);
router.get('/user-auth',loginMiddleware, (req,res) => {
    res.status(200).send({ok:true}); 
})

export default router;
