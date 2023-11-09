import { Router } from "express";
import {
  creditAmount,
  creditUserAccount,
  deditAmount,
} from "../Controller/giftController";

const router = Router();

router.route("/:userID/credit-wallet").post(creditAmount);
router.route("/:userID/debit-wallet").post(deditAmount);
router.route("/:userId/credit-amount").post(creditUserAccount);

export default router;
