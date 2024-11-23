import express from "express";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
import cron from "node-cron";
import { f100, f100Distribute } from "../controllers/f100.controller.js";

const router = express.Router();

router.route('/f100-eligiblity').put(f100);
router.route('/f100-distribution').put(f100Distribute);



export default router;
