import express from "express";
import {Investerlogin, InvesterSignUp} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import cron from "node-cron";
const router = express.Router();

router.route('/register').post(InvesterSignUp);
router.route('/login').post(Investerlogin);

export default router;
