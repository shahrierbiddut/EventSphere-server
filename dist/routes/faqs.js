"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FAQ_1 = __importDefault(require("../models/FAQ"));
const router = (0, express_1.Router)();
// Get all FAQs grouped by category
router.get("/", async (req, res, next) => {
    try {
        const faqs = await FAQ_1.default.find({ active: true }).sort({
            category: 1,
            order: 1,
        });
        return res.json(faqs);
    }
    catch (error) {
        return next(error);
    }
});
// Get FAQs by category
router.get("/category/:category", async (req, res, next) => {
    try {
        const faqs = await FAQ_1.default.find({
            category: req.params.category,
            active: true,
        }).sort({ order: 1 });
        return res.json(faqs);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
