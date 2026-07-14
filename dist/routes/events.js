"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Event_1 = __importDefault(require("../models/Event"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", async (req, res, next) => {
    try {
        const { search, category, featured } = req.query;
        const filter = {
            isPublished: true,
            status: "published"
        };
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
router.post("/", auth_1.verifyToken, async (req, res, next) => {
    try {
        const eventData = req.body;
        // Generate slug from title if not provided
        if (!eventData.slug && eventData.title) {
            eventData.slug = eventData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '') + '-' + Date.now();
        }
        // Force pending status and unpublished for user-submitted events
        const newEvent = new Event_1.default({
            ...eventData,
            status: "pending",
            isPublished: false,
            submittedBy: req.user?._id
        });
        await newEvent.save();
        return res.status(201).json(newEvent);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
