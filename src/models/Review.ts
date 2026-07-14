import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true, trim: true },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
