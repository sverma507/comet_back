import express from "express";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
import cron from "node-cron";
import { backAmount100 } from "../controllers/backAmount100.controller.js";

const router = express.Router();

router.route('/backamount-eligiblity').put(backAmount100);



export default router;
