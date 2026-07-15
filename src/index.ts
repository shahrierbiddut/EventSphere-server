import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import bookingRoutes from "./routes/bookings";
import eventRoutes from "./routes/events";
import userRoutes from "./routes/users";
import categoryRoutes from "./routes/categories";
import blogRoutes from "./routes/blogs";
import faqRoutes from "./routes/faqs";
import { seedInitialData } from "./utils/seed";
import adminRoutes from "./routes/admin";

dotenv.config({ quiet: true });

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://eventsphere-api-client.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Server is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({
    message: `Not Found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const message = error instanceof Error ? error.message : "Server error";
    console.error(error);
    res.status(500).json({ message });
  },
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedInitialData();

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

startServer();
