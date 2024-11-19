import express from "express";
import {InvesterSignUp} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import cron from "node-cron";
const router = express.Router();

router.route('/register').post(InvesterSignUp);
// router.route('/login').post(login); 



// cron.schedule('0 0 * * *', () => {
//     // Convert 12:00 AM IST to UTC
//     const IST_UTC_OFFSET = 5.5; // IST is UTC+5:30
//     const currentHourUTC = new Date().getUTCHours();
//     const currentDayUTC = new Date().getUTCDay(); // Get the current day of the week (0-6)
  
//     // Check if it's a weekday (Monday to Friday)
//     if (currentHourUTC === 18.5 && currentDayUTC !== 0 && currentDayUTC !== 6) { // 0 = Sunday, 6 = Saturday
//         updateAllUserPackageStatuses()
//     }
//   }, {
//     timezone: "Asia/Kolkata"
//   });


export default router;
