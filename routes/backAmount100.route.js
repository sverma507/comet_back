import express from "express";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
import cron from "node-cron";
import { backAmount100, backAmount100Distribution } from "../controllers/backAmount100.controller.js";

const router = express.Router();

router.route('/backamount-eligiblity').put(backAmount100);
router.route('/backamount-distribution').put(backAmount100Distribution);



export default router;
