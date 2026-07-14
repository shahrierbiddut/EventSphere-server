import dns from "dns";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer | null = null;

const configureDns = () => {
  const dnsServers = process.env.DNS_SERVERS
    ?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers?.length) {
    dns.setServers(dnsServers);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      configureDns();

      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log("✅ MongoDB Connected");
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(
        `⚠️ Atlas connection failed, falling back to local MongoDB. ${message}`,
      );
    }
  }

  try {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
    }

    const localUri = await mongoServer.getUri();
    await mongoose.connect(localUri);
    console.log("✅ MongoDB Connected to local in-memory server");
  } catch (error) {
    console.error("❌ Local MongoDB fallback failed", error);
    process.exit(1);
  }
};

export default connectDB;
