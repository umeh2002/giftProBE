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
exports.deleteTransaction = exports.getTransactionHistory = exports.deditAmount = exports.creditUserAccount = exports.creditAmount = void 0;
const giftModel_1 = __importDefault(require("../Model/giftModel"));
const authModel_1 = __importDefault(require("../Model/authModel"));
const creditAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { email, amount } = req.body;
        const user = yield authModel_1.default.findById(userID);
        if (user) {
            const transaction = yield giftModel_1.default.create({
                email,
                amount: parseInt(amount),
                typeOfTransaction: "credit",
            });
            user.wallet += parseInt(amount);
            yield user.save();
            return res.status(201).json({
                message: "Successfully created",
                data: transaction,
            });
        }
        else {
            return res.status(403).json({
                message: "User not found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Invalid credit amount",
            data: error.message,
        });
    }
});
exports.creditAmount = creditAmount;
const creditUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, amount } = req.body;
        const { userId } = req.params;
        const user = yield authModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.wallet += amount;
        yield user.save();
        const transaction = new giftModel_1.default({
            userId: userId,
            amount: amount,
            email,
            typeOfTransaction: "credit",
        });
        yield transaction.save();
        return res
            .status(200)
            .json({ message: "Account credited successfully", data: transaction });
    }
    catch (error) {
        return res.status(404).json({ message: "Error", error: error.message });
    }
});
exports.creditUserAccount = creditUserAccount;
const deditAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { amount, email } = req.body;
        const user = yield authModel_1.default.findById(userID);
        if (user) {
            if (user.wallet < amount) {
                return res.status(404).json({
                    message: "insufficient funds",
                });
            }
            else {
                const transaction = yield giftModel_1.default.create({
                    email,
                    amount: parseInt(amount),
                    typeOfTransaction: "debit",
                });
                user.wallet -= amount;
                yield user.save();
                return res.status(201).json({
                    message: "withdraw transaction",
                    data: transaction,
                });
            }
        }
        else {
            return res.status(404).json({
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
exports.deditAmount = deditAmount;
const getTransactionHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const transactions = yield giftModel_1.default.find({ userId: userId });
        if (transactions.length === 0) {
            return res
                .status(404)
                .json({ message: "No transaction history found for this user" });
        }
        return res.status(200).json({ transactions: transactions });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
});
exports.getTransactionHistory = getTransactionHistory;
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const transaction = yield giftModel_1.default.findByIdAndDelete(_id);
        return res.status(200).json({ message: "succes", data: transaction });
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
            data: error.message,
        });
    }
});
exports.deleteTransaction = deleteTransaction;
