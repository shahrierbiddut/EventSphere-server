import { Router } from "express";
import User from "../models/User";
import { publicUser, signToken } from "../utils/jwt";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, photoUrl } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({ name, email, password, photoUrl });
    const token = signToken(user);

    return res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);

    return res.json({ token, user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

export default router;
