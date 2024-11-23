import express from "express";
import {getUserRechargeHistory, Investerlogin, InvesterSignUp, myTeamMembers, userRecharge} from "../controllers/user.controller.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
import cron from "node-cron";
import { loginMiddleware } from "../middlewares/auth.js";
const router = express.Router();

router.route('/register').post(InvesterSignUp);
router.route('/login').post(Investerlogin);
router.route('/team-members/:id/:level').get(myTeamMembers);
router.route('/recharge/:userId/:amount').post(userRecharge);
router.route('/recharge-history/:userId/').post(getUserRechargeHistory)
router.get('/user-auth',loginMiddleware, (req,res) => {
    res.status(200).send({ok:true}); 
})

export default router;
