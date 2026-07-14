import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth";
import Booking from "../models/Booking";
import ContactMessage from "../models/ContactMessage";
import Event from "../models/Event";
import Review from "../models/Review";
import User from "../models/User";

const router = Router();

// Secure all admin routes
router.use(adminAuth);

// ==========================================
// OVERVIEW & STATS
// ==========================================
router.get("/stats", async (_req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Revenue placeholder (sum of total price in confirmed bookings)
    const revenueAggregation = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueAggregation[0]?.total || 0;

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email photoUrl")
      .populate("event", "title");

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt");

    res.json({
      totalUsers,
      totalEvents,
      totalBookings,
      totalRevenue,
      recentBookings,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats", error });
  }
});

// ==========================================
// USERS
// ==========================================
router.get("/users", async (req, res) => {
  try {
    const { q = "", page = "1", limit = "10", status = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {};
    if (q) {
      query.$or = [
        { name: { $regex: q as string, $options: "i" } },
        { email: { $regex: q as string, $options: "i" } },
      ];
    }
    if (status) {
      query.role = status;
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

router.patch("/users/:id/block", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Toggle role between attendee and blocked
    // NOTE: If they were organizer, they become blocked. Unblocking restores them to attendee by default in this simple logic.
    user.role = user.role === "blocked" ? "attendee" : "blocked";
    await user.save();

    res.json({ message: `User ${user.role === "blocked" ? "blocked" : "unblocked"} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user status", error });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// ==========================================
// EVENTS
// ==========================================
router.get("/events", async (req, res) => {
  try {
    const { q = "", page = "1", limit = "10", category = "", status = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {};
    if (q) query.title = { $regex: q as string, $options: "i" };
    if (category) query.category = category;
    if (status) query.status = status;

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Event.countDocuments(query);

    res.json({ events, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

router.post("/events", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
});

router.patch("/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
});

router.delete("/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
});

router.patch("/events/:id/publish", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    event.isPublished = !event.isPublished;
    event.status = event.isPublished ? "published" : "draft";
    await event.save();

    res.json({ message: `Event ${event.isPublished ? "published" : "unpublished"}`, event });
  } catch (error) {
    res.status(500).json({ message: "Error publishing event", error });
  }
});

router.patch("/events/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    event.status = status;
    if (status === "published") {
      event.isPublished = true;
    } else if (status === "rejected") {
      event.isPublished = false;
    }
    
    await event.save();
    res.json({ message: `Event status updated to ${status}`, event });
  } catch (error) {
    res.status(500).json({ message: "Error updating event status", error });
  }
});

// ==========================================
// CATEGORIES
// ==========================================
router.get("/categories", async (_req, res) => {
  try {
    // Get unique categories and count of events for each
    const aggregation = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json(aggregation.map(a => ({ name: a._id, eventCount: a.count })));
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
});

// ==========================================
// BOOKINGS
// ==========================================
router.get("/bookings", async (req, res) => {
  try {
    const { page = "1", limit = "10", status = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate("user", "name email photoUrl")
      .populate("event", "title date time category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});

router.patch("/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // confirmed, cancelled
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate("user", "name email")
      .populate("event", "title");
      
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status", error });
  }
});

// ==========================================
// REVIEWS
// ==========================================
router.get("/reviews", async (req, res) => {
  try {
    const { page = "1", limit = "10" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find()
      .populate("user", "name photoUrl")
      .populate("event", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments();

    res.json({ reviews, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
});

router.patch("/reviews/:id/hide", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    
    review.isHidden = !review.isHidden;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error hiding review", error });
  }
});

router.delete("/reviews/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
});

// ==========================================
// CONTACT MESSAGES
// ==========================================
router.get("/messages/unread-count", async (req, res) => {
  try {
    const count = await ContactMessage.countDocuments({ isRead: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread messages count", error });
  }
});

router.get("/messages", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
});

router.patch("/messages/:id/read", async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Error marking message as read", error });
  }
});

router.delete("/messages/:id", async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error });
  }
});

// ==========================================
// ANALYTICS
// ==========================================
router.get("/analytics", async (_req, res) => {
  try {
    // Generate some mock historical data based on current counts for the charts
    const usersCount = await User.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    const eventsCount = await Event.countDocuments();
    
    const userGrowth = Array.from({length: 6}).map((_, i) => ({
      name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
      users: Math.floor(usersCount * (0.5 + (i * 0.1)))
    }));

    const bookingsOverview = Array.from({length: 6}).map((_, i) => ({
      name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
      bookings: Math.floor(bookingsCount * (0.3 + (i * 0.15))),
      revenue: Math.floor(bookingsCount * (0.3 + (i * 0.15)) * 120) // mock revenue
    }));

    const categoryDistribution = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: "$_id", value: "$count" } }
    ]);

    const bookingStatus = await Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", value: "$count" } }
    ]);

    res.json({
      userGrowth,
      bookingsOverview,
      categoryDistribution,
      bookingStatus
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error });
  }
});

export default router;
