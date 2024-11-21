import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import cron from "node-cron";
import { getAllUsers } from "../controllers/admin.controller.js";
const router = express.Router();

router.route('/all-users').post(getAllUsers);

export default router;
