import { Router } from "express";
import Category from "../models/Category";

const router = Router();

// Get all categories
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
});

// Get single category by slug
router.get("/:slug", async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json(category);
  } catch (error) {
    return next(error);
  }
});

export default router;
