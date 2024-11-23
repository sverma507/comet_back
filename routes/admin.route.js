import express from "express";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
import cron from "node-cron";
import { activateUser, activationHistory, adminLogin, getAllUsers, getUserActivationHistory } from "../controllers/admin.controller.js";
const router = express.Router();

router.route('/login').post(adminLogin); 
router.route('/all-users').get(getAllUsers);
router.route('/activate-user').put(activateUser);
router.route('/activate-user-history').get(activationHistory);
router.route('/activate-history/:userId').get(getUserActivationHistory);

export default router;
