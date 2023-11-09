"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const giftModel = new mongoose_1.default.Schema({
    userID: {
        type: String,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "auths",
    },
    amount: {
        type: Number,
    },
    email: {
        type: String,
    },
    typeOfTransaction: {
        type: String,
        enum: ['credit', 'debit']
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("gifts", giftModel);
