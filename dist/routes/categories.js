"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Category_1 = __importDefault(require("../models/Category"));
const router = (0, express_1.Router)();
// Get all categories
router.get("/", async (req, res, next) => {
    try {
        const categories = await Category_1.default.find().sort({ createdAt: 1 });
        return res.json(categories);
    }
    catch (error) {
        return next(error);
    }
});
// Get single category by slug
router.get("/:slug", async (req, res, next) => {
    try {
        const category = await Category_1.default.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.json(category);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
