import express from "express";
import { getAllBackAmountHistory } from "../controllers/backAmount100.controller.js";
import { getAllF00IncomeHistory } from "../controllers/f100.controller.js";
import { getAllMagicIncomeHistory } from "../controllers/magicIncome.controller.js";
import { getAllLevelIncomeHistory, getGlobalIncomeHistory, getWithdrawlUplineHistory } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.js";
const router = express.Router();

router.route('/back-amount/:userId').get(protect,getAllBackAmountHistory);
router.route('/f100/:userId').get(protect,getAllF00IncomeHistory);
router.route('/magic/:userId').get(protect,getAllMagicIncomeHistory);
router.route('/level/:userId').get(protect,getAllLevelIncomeHistory);
router.route('/withdrawl-upline/:userId').get(protect,getWithdrawlUplineHistory);
router.route('/global/:userId').get(protect,getGlobalIncomeHistory);

export default router;
