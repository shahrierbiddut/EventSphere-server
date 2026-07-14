"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialData = void 0;
const seedEvents_1 = __importDefault(require("../data/seedEvents"));
const Event_1 = __importDefault(require("../models/Event"));
const User_1 = __importDefault(require("../models/User"));
const seedInitialData = async () => {
    console.log("Syncing database events...");
    for (const eventData of seedEvents_1.default) {
        await Event_1.default.updateOne({ slug: eventData.slug }, { $set: eventData }, { upsert: true });
    }
    console.log(`Synced ${seedEvents_1.default.length} events successfully.`);
    const demoEmail = "demo@eventsphere.com";
    const demoUser = await User_1.default.findOne({ email: demoEmail });
    if (!demoUser) {
        await User_1.default.create({
            name: "Demo User",
            email: demoEmail,
            password: "password123",
            photoUrl: "https://i.pravatar.cc/100?img=12",
        });
        console.log("Seeded demo user");
    }
};
exports.seedInitialData = seedInitialData;
