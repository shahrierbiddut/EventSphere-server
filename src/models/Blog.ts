import mongoose, { Schema } from "mongoose";

const authorSchema = new Schema(
  {
    id: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    avatarUrl: { type: String, trim: true },
  },
  { _id: false },
);

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: authorSchema, required: true },
    imageUrl: { type: String, trim: true },
    category: { type: String, trim: true },
    readTime: { type: String, trim: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Blog", blogSchema);
