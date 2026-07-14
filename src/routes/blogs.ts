import { Router } from "express";
import FAQ from "../models/FAQ";

const router = Router();

// Get all FAQs grouped by category
router.get("/", async (req, res, next) => {
  try {
    const faqs = await FAQ.find({ active: true }).sort({
      category: 1,
      order: 1,
    });
    return res.json(faqs);
  } catch (error) {
    return next(error);
  }
});

// Get FAQs by category
router.get("/category/:category", async (req, res, next) => {
  try {
    const faqs = await FAQ.find({
      category: req.params.category,
      active: true,
    }).sort({ order: 1 });
    return res.json(faqs);
  } catch (error) {
    return next(error);
  }
});

export default router;
