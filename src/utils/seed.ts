import seedEvents from "../data/seedEvents";
import Event from "../models/Event";
import User from "../models/User";

export const seedInitialData = async () => {
  console.log("Syncing database events...");
  for (const eventData of seedEvents) {
    await Event.updateOne(
      { slug: eventData.slug },
      { $set: eventData },
      { upsert: true }
    );
  }
  console.log(`Synced ${seedEvents.length} events successfully.`);


  const demoEmail = "demo@eventsphere.com";
  const demoUser = await User.findOne({ email: demoEmail });

  if (!demoUser) {
    await User.create({
      name: "Demo User",
      email: demoEmail,
      password: "password123",
      photoUrl: "https://i.pravatar.cc/100?img=12",
    });
    console.log("Seeded demo user");
  }

  // Seed admin user
  const adminEmail = "admin@eventsphere.com";
  const adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: "admin123",
      role: "admin",
      photoUrl: "https://i.pravatar.cc/100?img=3",
    });
    console.log("Seeded admin user");
  }
};
