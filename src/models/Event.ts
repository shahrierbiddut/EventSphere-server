import mongoose, { Schema } from "mongoose";

const organizerSchema = new Schema(
  {
    id: { type: String },
    name: { type: String, required: true, trim: true },
    logoUrl: { type: String, trim: true },
    description: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
  },
  { _id: false },
);

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isFree: { type: Boolean, default: false },
    availableSeats: { type: Number, required: true, min: 0 },
    totalSeats: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, required: true, trim: true },
    galleryImages: [{ type: String, trim: true }],
    organizer: { type: organizerSchema, required: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    status: { type: String, enum: ["draft", "pending", "published", "rejected"], default: "published" },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

eventSchema.virtual("id").get(function getId() {
  return this._id.toString();
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;

