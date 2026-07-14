import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import Booking from "../models/Booking";
import Event from "../models/Event";

const router = Router();

router.use(verifyToken);

router.get("/", async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const bookings = await Booking.find({ user: userId })
      .populate("event")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { eventId, quantity = 1 } = req.body;
    const requestedSeats = Number(quantity);

    if (!eventId || Number.isNaN(requestedSeats) || requestedSeats < 1) {
      return res.status(400).json({ message: "A valid eventId and quantity are required" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableSeats < requestedSeats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    event.availableSeats -= requestedSeats;
    await event.save();

    const booking = await Booking.create({
      user: userId,
      event: event._id,
      quantity: requestedSeats,
      totalPrice: event.price * requestedSeats,
    });

    await booking.populate("event");

    return res.status(201).json(booking);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const bookingId = req.params.id;

    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Restore event seats
    const event = await Event.findById(booking.event);
    if (event) {
      event.availableSeats += booking.quantity;
      await event.save();
    }

    return res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    return next(error);
  }
});

export default router;
