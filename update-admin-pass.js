"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const updateAdminPassword = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI || "mongodb://localhost:27017/eventsphere");
        console.log("Connected to MongoDB.");
        const db = mongoose_1.default.connection.db;
        if (!db) {
            throw new Error("No database connection");
        }
        const hashedPassword = await bcryptjs_1.default.hash("admin123", 12);
        const result = await db.collection("users").updateOne({ email: "admin@eventsphere.com" }, { $set: { password: hashedPassword } });
        if (result.matchedCount > 0) {
            console.log("Admin password successfully reset to 'admin123'.");
        }
        else {
            console.log("Admin user not found.");
        }
        process.exit(0);
    }
    catch (error) {
        console.error("Error updating password:", error);
        process.exit(1);
    }
};
updateAdminPassword();
