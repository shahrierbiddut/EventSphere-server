"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dns_1 = __importDefault(require("dns"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
let mongoServer = null;
const configureDns = () => {
    const dnsServers = process.env.DNS_SERVERS
        ?.split(",")
        .map((server) => server.trim())
        .filter(Boolean);
    if (dnsServers?.length) {
        dns_1.default.setServers(dnsServers);
    }
};
const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (mongoUri) {
        try {
            configureDns();
            await mongoose_1.default.connect(mongoUri, {
                serverSelectionTimeoutMS: 4000,
            });
            console.log("✅ MongoDB Connected");
            return;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`⚠️ Atlas connection failed, falling back to local MongoDB. ${message}`);
        }
    }
    try {
        if (!mongoServer) {
            mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        }
        const localUri = await mongoServer.getUri();
        await mongoose_1.default.connect(localUri);
        console.log("✅ MongoDB Connected to local in-memory server");
    }
    catch (error) {
        console.error("❌ Local MongoDB fallback failed", error);
        process.exit(1);
    }
};
exports.default = connectDB;
