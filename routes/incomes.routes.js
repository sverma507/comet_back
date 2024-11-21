import express from "express";
import { getAllBackAmountHistory } from "../controllers/backAmount100.controller";
import { getAllF00IncomeHistory } from "../controllers/f100.controller";
import { getAllMagicIncomeHistory } from "../controllers/magicIncome.controller";
import { getAllLevelIncomeHistory } from "../controllers/user.controller";
const router = express.Router();

router.route('/back-amount').get(getAllBackAmountHistory);
router.route('/f100').get(getAllF00IncomeHistory);
router.route('/magic').get(getAllMagicIncomeHistory);
router.route('/level').get(getAllLevelIncomeHistory);

export default router;
