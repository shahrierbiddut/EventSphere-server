import { Router } from "express";
import Event from "../models/Event";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { search, category, featured } = req.query;
    const filter: Record<string, unknown> = {
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

    const events = await Event.find(filter).sort({ createdAt: -1 });
    return res.json(events);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(event);
  } catch (error) {
    return next(error);
  }
});

router.post("/", auth, async (req: any, res, next) => {
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
    const newEvent = new Event({
      ...eventData,
      status: "pending",
      isPublished: false,
      submittedBy: req.user?._id
    });

    await newEvent.save();
    return res.status(201).json(newEvent);
  } catch (error) {
    return next(error);
  }
});

export default router;
