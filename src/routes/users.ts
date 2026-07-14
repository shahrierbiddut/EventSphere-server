import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import User from "../models/User";
import Event from "../models/Event";
import { publicUser } from "../utils/jwt";

const router = Router();

router.use(verifyToken);

// Get current user profile
router.get("/me", async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).populate("favoriteEvents");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ ...publicUser(user), favoriteEvents: user.favoriteEvents });
  } catch (error) {
    return next(error);
  }
});

// Update user profile
router.patch("/me", async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { name, phone, bio, address, photoUrl } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (address !== undefined) user.address = address;
    if (photoUrl !== undefined) user.photoUrl = photoUrl;

    await user.save();

    return res.json({ ...publicUser(user), favoriteEvents: user.favoriteEvents });
  } catch (error) {
    return next(error);
  }
});

// Change password
router.patch("/me/password", async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return next(error);
  }
});

// Get favorite events
router.get("/me/favorites", async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).populate("favoriteEvents");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user.favoriteEvents || []);
  } catch (error) {
    return next(error);
  }
});

// Add favorite event
router.post("/me/favorites", async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const user = await User.findById(userId);
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
  } catch (error) {
    return next(error);
  }
});

// Remove favorite event
router.delete("/me/favorites/:eventId", async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { eventId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.favoriteEvents) {
      user.favoriteEvents = user.favoriteEvents.filter(
        (id) => id.toString() !== eventId
      );
      await user.save();
    }

    return res.json(user.favoriteEvents);
  } catch (error) {
    return next(error);
  }
});

export default router;
