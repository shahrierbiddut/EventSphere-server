"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const events_1 = __importDefault(require("./routes/events"));
const users_1 = __importDefault(require("./routes/users"));
const categories_1 = __importDefault(require("./routes/categories"));
const blogs_1 = __importDefault(require("./routes/blogs"));
const faqs_1 = __importDefault(require("./routes/faqs"));
const seed_1 = require("./utils/seed");
const admin_1 = __importDefault(require("./routes/admin"));
dotenv_1.default.config({ quiet: true });
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://eventsphere-api-client.vercel.app",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.send("Server is running!");
});
app.use("/api/auth", auth_1.default);
app.use("/api/events", events_1.default);
app.use("/api/bookings", bookings_1.default);
app.use("/api/users", users_1.default);
app.use("/api/categories", categories_1.default);
app.use("/api/blogs", blogs_1.default);
app.use("/api/faqs", faqs_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api", (req, res) => {
    res.status(404).json({
        message: `Not Found: ${req.method} ${req.originalUrl}`,
    });
});
app.use((error, _req, res, _next) => {
    const message = error instanceof Error ? error.message : "Server error";
    console.error(error);
    res.status(500).json({ message });
});
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await (0, db_1.default)();
    await (0, seed_1.seedInitialData)();
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
};
startServer();
