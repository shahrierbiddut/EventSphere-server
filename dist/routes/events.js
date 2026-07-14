"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Event_1 = __importDefault(require("../models/Event"));
const router = (0, express_1.Router)();
router.get("/", async (req, res, next) => {
    try {
        const { search, category, featured } = req.query;
        const filter = {};
        if (typeof category === "string" && category) {
            filter.category = category;
        }
        if (featured === "true") {
            filter.isFeatured = true;
        }
        if (typeof search === "string" && search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { venue: { $regex: search, $options: "i" } },
            ];
        }
        const events = await Event_1.default.find(filter).sort({ createdAt: -1 });
        return res.json(events);
    }
    catch (error) {
        return next(error);
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const event = await Event_1.default.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.json(event);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
