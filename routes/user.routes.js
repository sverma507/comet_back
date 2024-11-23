import express from "express";
import {Investerlogin, InvesterSignUp, myTeamMembers} from "../controllers/user.controller.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
import cron from "node-cron";
import { loginMiddleware } from "../middlewares/auth.js";
const router = express.Router();

router.route('/register').post(InvesterSignUp);
router.route('/login').post(Investerlogin);
router.route('/team-members/:id/:level').get(myTeamMembers);
router.get('/user-auth',loginMiddleware, (req,res) => {
    res.status(200).send({ok:true}); 
})

export default router;
