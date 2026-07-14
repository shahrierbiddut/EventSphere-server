import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    ticketCode: {
      type: String,
      default: () => Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
  },
  { timestamps: true },
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
