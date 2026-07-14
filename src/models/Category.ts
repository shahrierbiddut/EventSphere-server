import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, trim: true },
    iconName: { type: String, trim: true },
    eventCount: { type: Number, default: 0, min: 0 },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model("Category", categorySchema);
