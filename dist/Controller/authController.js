"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstVerified = exports.verifyUser = exports.signInUser = exports.deleteUser = exports.viewOne = exports.viewAll = exports.registerUser = void 0;
const authModel_1 = __importDefault(require("../Model/authModel"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, password, email } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const value = crypto_1.default.randomBytes(10).toString("hex");
        const token = jsonwebtoken_1.default.sign(value, "secret");
        const user = yield authModel_1.default.create({
            name,
            password: hash,
            email,
            token,
            wallet: 200,
        });
        (0, email_1.sendFirstAccountMail)(user).then(() => {
            console.log("sent an otp");
        });
        return res.status(201).json({
            message: "created user successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error registering",
            data: error.message,
        });
    }
});
exports.registerUser = registerUser;
const viewAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield authModel_1.default.find();
        return res.status(200).json({
            message: "Success",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
            data: error.message,
        });
    }
});
exports.viewAll = viewAll;
const viewOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield authModel_1.default.findById(userID);
        return res.status(200).json({
            message: "Success",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Invalid",
            data: error.message,
        });
    }
});
exports.viewOne = viewOne;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield authModel_1.default.findByIdAndDelete(userID);
        return res.status(201).json({
            message: "deleted user successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "User not deleted",
            data: error.message,
        });
    }
});
exports.deleteUser = deleteUser;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield authModel_1.default.findOne({ email: email });
        if (user) {
            const check = yield bcrypt_1.default.compare(password, user.password);
            if (check) {
                if (user.verify && user.token === "") {
                    const token = jsonwebtoken_1.default.sign({ id: user._id }, "secret");
                    return res.status(201).json({
                        message: `welcome ${user.name}`,
                        data: token,
                    });
                }
                else {
                    return res.status(403).json({
                        message: "user is not authorized",
                    });
                }
            }
            else {
                return res.status(403).json({
                    message: "password is incorrect",
                });
            }
        }
        else {
            return res.status(403).json({
                message: "User not found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
            data: error.message,
        });
    }
});
exports.signInUser = signInUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const getID = jsonwebtoken_1.default.verify(token, "secret", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload;
            }
        });
        const user = yield authModel_1.default.findByIdAndUpdate(getID.id, { token: "", verify: true }, { new: true });
        return res.status(201).json({
            message: "verification successful",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
            data: error.message,
        });
    }
});
exports.verifyUser = verifyUser;
const firstVerified = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { secretKey } = req.body;
        const { token } = req.params;
        jsonwebtoken_1.default.verify(token, "secret", (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(401).json({
                    message: "Invalid token",
                });
            }
            const user = yield authModel_1.default.findByIdAndUpdate(payload.id, { secretKey }, { new: true });
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            user.secretKey = secretKey;
            try {
                yield user.save();
                (0, email_1.sendAccountMail)(user).then(() => {
                    console.log("sent verification email");
                });
                return res.status(201).json({
                    message: "success",
                    data: user,
                });
            }
            catch (emailError) {
                return res.status(500).json({
                    message: "Error sending verification email",
                    data: emailError.message,
                });
            }
        }));
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error.message,
        });
    }
});
exports.firstVerified = firstVerified;
