import seedEvents from "../data/seedEvents";
import { seedCategories, seedBlogs, seedFAQs } from "../data/seedData";
import Event from "../models/Event";
import Category from "../models/Category";
import Blog from "../models/Blog";
import FAQ from "../models/FAQ";
import User from "../models/User";

export const seedInitialData = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    console.log("Syncing database events...");
    for (const eventData of seedEvents) {
      await Event.updateOne(
        { slug: eventData.slug },
        { $set: eventData },
        { upsert: true },
      );
    }
    console.log(`✓ Synced ${seedEvents.length} events successfully.`);

    // Seed categories
    console.log("Syncing categories...");
    for (const categoryData of seedCategories) {
      await Category.updateOne(
        { slug: categoryData.slug },
        { $set: categoryData },
        { upsert: true },
      );
    }
    console.log(`✓ Synced ${seedCategories.length} categories successfully.`);

    // Seed blogs
    console.log("Syncing blogs...");
    for (const blogData of seedBlogs) {
      await Blog.updateOne(
        { slug: blogData.slug },
        { $set: blogData },
        { upsert: true },
      );
    }
    console.log(`✓ Synced ${seedBlogs.length} blogs successfully.`);

    // Seed FAQs
    console.log("Syncing FAQs...");
    for (const faqData of seedFAQs) {
      await FAQ.updateOne(
        { question: faqData.question },
        { $set: faqData },
        { upsert: true },
      );
    }
    console.log(`✓ Synced ${seedFAQs.length} FAQs successfully.`);

    // Seed demo user
    const demoEmail = "demo@eventsphere.com";
    const demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      const newDemoUser = await User.create({
        name: "Demo User",
        email: demoEmail,
        password: "password123",
        photoUrl: "https://i.pravatar.cc/100?img=12",
        role: "attendee",
      });
      console.log(`✓ Seeded demo user: ${newDemoUser.email}`);
    } else {
      console.log(`✓ Demo user already exists: ${demoUser.email}`);
    }

    // Seed admin user
    const adminEmail = "admin@eventsphere.com";
    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const newAdminUser = await User.create({
        name: "Admin",
        email: adminEmail,
        password: "admin123",
        role: "admin",
        photoUrl: "https://i.pravatar.cc/100?img=3",
      });
      console.log(`✓ Seeded admin user: ${newAdminUser.email} (role: admin)`);
    } else {
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
      } else {
        console.log(`✓ Admin user already exists: ${adminUser.email}`);
      }
    }

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  }
};
