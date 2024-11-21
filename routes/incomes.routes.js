import express from "express";
import { getAllBackAmountHistory } from "../controllers/backAmount100.controller.js";
import { getAllF00IncomeHistory } from "../controllers/f100.controller.js";
import { getAllMagicIncomeHistory } from "../controllers/magicIncome.controller.js";
import { getAllLevelIncomeHistory } from "../controllers/user.controller.js";
const router = express.Router();

router.route('/back-amount/:userId').get(getAllBackAmountHistory);
router.route('/f100/:userId').get(getAllF00IncomeHistory);
router.route('/magic/:userId').get(getAllMagicIncomeHistory);
router.route('/level/:userId').get(getAllLevelIncomeHistory);

export default router;
