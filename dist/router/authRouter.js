"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../Controller/authController");
const validatorHandler_1 = __importDefault(require("../utils/validatorHandler"));
const validator_1 = require("../utils/validator");
const router = (0, express_1.Router)();
router
    .route("/create-user")
    .post((0, validatorHandler_1.default)(validator_1.registerValidator), authController_1.registerUser);
router.route("/sign-in").post((0, validatorHandler_1.default)(validator_1.signInValidator), authController_1.signInUser);
router.route("/get-all").get(authController_1.viewAll);
router.route("/:userID/delete-one").delete(authController_1.deleteUser);
router.route("/:userID/view-one").get(authController_1.viewOne);
router.route("/:token/first-verify").get(authController_1.firstVerified);
router.route("/:token/verify-account").get(authController_1.verifyUser);
exports.default = router;
