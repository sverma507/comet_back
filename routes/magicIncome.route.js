import express from "express";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
import cron from "node-cron";
import { magicIncome } from "../controllers/magicIncome.controller.js";

const router = express.Router();

router.route('/magicIncome-distribute').put(magicIncome);




export default router;
