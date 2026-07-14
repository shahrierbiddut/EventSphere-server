import jwt from "jsonwebtoken";
import { UserDocument } from "../models/User";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

export const signToken = (user: UserDocument) =>
  jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: "7d" },
  );

export const publicUser = (user: UserDocument) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  photoUrl: user.photoUrl,
  phone: user.phone,
  bio: user.bio,
  address: user.address,
  role: user.role,
});
