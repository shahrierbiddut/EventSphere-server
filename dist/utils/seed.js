"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialData = void 0;
const seedEvents_1 = __importDefault(require("../data/seedEvents"));
const seedData_1 = require("../data/seedData");
const Event_1 = __importDefault(require("../models/Event"));
const Category_1 = __importDefault(require("../models/Category"));
const Blog_1 = __importDefault(require("../models/Blog"));
const FAQ_1 = __importDefault(require("../models/FAQ"));
const User_1 = __importDefault(require("../models/User"));
const seedInitialData = async () => {
    try {
        console.log("🌱 Starting database seeding...");
        console.log("Syncing database events...");
        for (const eventData of seedEvents_1.default) {
            await Event_1.default.updateOne({ slug: eventData.slug }, { $set: eventData }, { upsert: true });
        }
        console.log(`✓ Synced ${seedEvents_1.default.length} events successfully.`);
        // Seed categories
        console.log("Syncing categories...");
        for (const categoryData of seedData_1.seedCategories) {
            await Category_1.default.updateOne({ slug: categoryData.slug }, { $set: categoryData }, { upsert: true });
        }
        console.log(`✓ Synced ${seedData_1.seedCategories.length} categories successfully.`);
        // Seed blogs
        console.log("Syncing blogs...");
        for (const blogData of seedData_1.seedBlogs) {
            await Blog_1.default.updateOne({ slug: blogData.slug }, { $set: blogData }, { upsert: true });
        }
        console.log(`✓ Synced ${seedData_1.seedBlogs.length} blogs successfully.`);
        // Seed FAQs
        console.log("Syncing FAQs...");
        for (const faqData of seedData_1.seedFAQs) {
            await FAQ_1.default.updateOne({ question: faqData.question }, { $set: faqData }, { upsert: true });
        }
        console.log(`✓ Synced ${seedData_1.seedFAQs.length} FAQs successfully.`);
        // Seed demo user
        const demoEmail = "demo@eventsphere.com";
        const demoUser = await User_1.default.findOne({ email: demoEmail });
        if (!demoUser) {
            const newDemoUser = await User_1.default.create({
                name: "Demo User",
                email: demoEmail,
                password: "password123",
                photoUrl: "https://i.pravatar.cc/100?img=12",
                role: "attendee",
            });
            console.log(`✓ Seeded demo user: ${newDemoUser.email}`);
        }
        else {
            console.log(`✓ Demo user already exists: ${demoUser.email}`);
        }
        // Seed admin user
        const adminEmail = "admin@eventsphere.com";
        const adminUser = await User_1.default.findOne({ email: adminEmail });
        if (!adminUser) {
            const newAdminUser = await User_1.default.create({
                name: "Admin",
                email: adminEmail,
                password: "admin123",
                role: "admin",
                photoUrl: "https://i.pravatar.cc/100?img=3",
            });
            console.log(`✓ Seeded admin user: ${newAdminUser.email} (role: admin)`);
        }
        else {
            // Make sure existing admin user has correct role and reset password for demo purposes
            let needsSave = false;
            if (adminUser.role !== "admin") {
                adminUser.role = "admin";
                needsSave = true;
            }
            // Force reset password so user doesn't get locked out during review
            adminUser.password = "admin123";
            needsSave = true;
            if (needsSave) {
                await adminUser.save();
                console.log(`✓ Updated existing admin user (role/password reset): ${adminUser.email}`);
            }
            else {
                console.log(`✓ Admin user already exists: ${adminUser.email}`);
            }
        }
        console.log("✅ Database seeding completed successfully!");
    }
    catch (error) {
        console.error("❌ Error during seeding:", error);
    }
};
exports.seedInitialData = seedInitialData;
