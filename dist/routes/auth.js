"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password, photoUrl } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered" });
        }
        const user = await User_1.default.create({ name, email, password, photoUrl });
        const token = (0, jwt_1.signToken)(user);
        return res.status(201).json({ token, user: (0, jwt_1.publicUser)(user) });
    }
    catch (error) {
        return next(error);
    }
});
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User_1.default.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = (0, jwt_1.signToken)(user);
        return res.json({ token, user: (0, jwt_1.publicUser)(user) });
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
