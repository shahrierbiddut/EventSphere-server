"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const Event_1 = __importDefault(require("../models/Event"));
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
router.use(auth_1.verifyToken);
// Get current user profile
router.get("/me", async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User_1.default.findById(userId).populate("favoriteEvents");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ ...(0, jwt_1.publicUser)(user), favoriteEvents: user.favoriteEvents });
    }
    catch (error) {
        return next(error);
    }
});
// Update user profile
router.patch("/me", async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, phone, bio, address, photoUrl } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (name)
            user.name = name;
        if (phone !== undefined)
            user.phone = phone;
        if (bio !== undefined)
            user.bio = bio;
        if (address !== undefined)
            user.address = address;
        if (photoUrl !== undefined)
            user.photoUrl = photoUrl;
        await user.save();
        return res.json({ ...(0, jwt_1.publicUser)(user), favoriteEvents: user.favoriteEvents });
    }
    catch (error) {
        return next(error);
    }
});
// Change password
router.patch("/me/password", async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" });
        }
        const user = await User_1.default.findById(userId).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(400).json({ message: "Incorrect current password" });
        }
        user.password = newPassword;
        await user.save();
        return res.json({ message: "Password updated successfully" });
    }
    catch (error) {
        return next(error);
    }
});
// Get favorite events
router.get("/me/favorites", async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User_1.default.findById(userId).populate("favoriteEvents");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user.favoriteEvents || []);
    }
    catch (error) {
        return next(error);
    }
});
// Add favorite event
router.post("/me/favorites", async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { eventId } = req.body;
        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required" });
        }
        const event = await Event_1.default.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.favoriteEvents) {
            user.favoriteEvents = [];
        }
        if (!user.favoriteEvents.includes(event._id)) {
            user.favoriteEvents.push(event._id);
            await user.save();
        }
        return res.json(user.favoriteEvents);
    }
    catch (error) {
        return next(error);
    }
});
// Remove favorite event
router.delete("/me/favorites/:eventId", async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { eventId } = req.params;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.favoriteEvents) {
            user.favoriteEvents = user.favoriteEvents.filter((id) => id.toString() !== eventId);
            await user.save();
        }
        return res.json(user.favoriteEvents);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
