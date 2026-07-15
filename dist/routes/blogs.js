"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Blog_1 = __importDefault(require("../models/Blog"));
const router = (0, express_1.Router)();
router.get("/", async (req, res, next) => {
    try {
        const blogs = await Blog_1.default.find({ published: true }).sort({
            createdAt: -1,
        });
        return res.json(blogs);
    }
    catch (error) {
        return next(error);
    }
});
router.get("/:slug", async (req, res, next) => {
    try {
        const blog = await Blog_1.default.findOne({
            slug: req.params.slug,
            published: true,
        });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        return res.json(blog);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
