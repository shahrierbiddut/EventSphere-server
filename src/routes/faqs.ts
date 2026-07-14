import { Router } from "express";
import Blog from "../models/Blog";

const router = Router();

// Get all published blogs
router.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (error) {
    return next(error);
  }
});

// Get single blog by slug
router.get("/:slug", async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.json(blog);
  } catch (error) {
    return next(error);
  }
});

export default router;
