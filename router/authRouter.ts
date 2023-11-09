import { Router } from "express";
import {
  deleteUser,
  firstVerified,
  registerUser,
  signInUser,
  verifyUser,
  viewAll,
  viewOne,
} from "../Controller/authController";
import validatorHandler from "../utils/validatorHandler";
import { registerValidator, signInValidator } from "../utils/validator";

const router = Router();

router
  .route("/create-user")
  .post(validatorHandler(registerValidator), registerUser);
router.route("/sign-in").post(validatorHandler(signInValidator), signInUser);
router.route("/get-all").get(viewAll);
router.route("/:userID/delete-one").delete(deleteUser);
router.route("/:userID/view-one").get(viewOne);
router.route("/:token/first-verify").get(firstVerified);
router.route("/:token/verify-account").get(verifyUser);
export default router;
