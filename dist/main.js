"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const giftRouter_1 = __importDefault(require("./router/giftRouter"));
const main = (app) => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use((0, morgan_1.default)("dev"));
    app.set('view engine', 'ejs');
    app.get("/", (req, res) => {
        try {
            return res.status(200).json({
                message: "welcome to my api",
            });
        }
        catch (error) {
            return res.status(404).json({
                message: "error",
                data: error.message,
            });
        }
    });
    app.use("/api", authRouter_1.default);
    app.use("/api", giftRouter_1.default);
};
exports.default = main;
