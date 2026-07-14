"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventById = exports.getEventList = exports.seedEvents = exports.fallbackEvents = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Event_1 = __importDefault(require("./models/Event"));
exports.fallbackEvents = [
    {
        id: "e1",
        title: "Global Tech Summit 2025",
        slug: "global-tech-summit-2025",
        category: "Technology",
        date: "15 Oct 2025",
        time: "09:00 AM - 06:00 PM",
        location: "Dhaka, Bangladesh",
        venue: "Bangabandhu International Conference Center",
        price: 150,
        isFree: false,
        availableSeats: 450,
        totalSeats: 1000,
        rating: 4.8,
        reviewCount: 320,
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
        galleryImages: [
            "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=500&auto=format&fit=crop",
        ],
        organizer: {
            name: "TechX Innovations",
            logoUrl: "https://ui-avatars.com/api/?name=TechX&background=0D8ABC&color=fff",
        },
        shortDescription: "Join the biggest tech gathering of the year featuring top speakers from AI, Web3, and Software Engineering.",
        description: "The Global Tech Summit 2025 brings together industry leaders, innovators, and tech enthusiasts from around the world.",
        isFeatured: true,
    },
    {
        id: "e2",
        title: "StartUp Founders Mixer",
        slug: "startup-founders-mixer",
        category: "Business",
        date: "22 Nov 2025",
        time: "06:30 PM - 09:30 PM",
        location: "Gulshan, Dhaka",
        venue: "The Westin Dhaka",
        price: 0,
        isFree: true,
        availableSeats: 12,
        totalSeats: 100,
        rating: 4.5,
        reviewCount: 85,
        imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=1000&auto=format&fit=crop",
        galleryImages: [],
        organizer: {
            name: "Dhaka StartUp Hub",
            logoUrl: "https://ui-avatars.com/api/?name=DSH&background=4F46E5&color=fff",
        },
        shortDescription: "An exclusive networking event for early-stage startup founders and angel investors.",
        description: "Connect with fellow founders, share experiences, and pitch your ideas to potential investors.",
        isFeatured: true,
    },
    {
        id: "e3",
        title: "Symphony Under The Stars",
        slug: "symphony-under-the-stars",
        category: "Music",
        date: "05 Dec 2025",
        time: "07:00 PM - 10:00 PM",
        location: "Sylhet, Bangladesh",
        venue: "Sylhet International Cricket Stadium Ground",
        price: 50,
        isFree: false,
        availableSeats: 0,
        totalSeats: 500,
        rating: 4.9,
        reviewCount: 412,
        imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop",
        galleryImages: [],
        organizer: {
            name: "Harmony Events",
            logoUrl: "https://ui-avatars.com/api/?name=Harmony&background=F59E0B&color=fff",
        },
        shortDescription: "A magical evening of classical music performed by the National Symphony Orchestra.",
        description: "Experience the magic of classical music in an open-air setting.",
        isFeatured: false,
    },
];
const seedEvents = async () => {
    if (mongoose_1.default.connection.readyState !== 1) {
        return;
    }
    const count = await Event_1.default.countDocuments();
    if (count > 0) {
        return;
    }
    await Event_1.default.create(exports.fallbackEvents.map(({ id, ...event }) => ({ ...event })));
};
exports.seedEvents = seedEvents;
const getEventList = async () => {
    if (mongoose_1.default.connection.readyState !== 1) {
        return exports.fallbackEvents;
    }
    try {
        const events = await Event_1.default.find().sort({ createdAt: -1 });
        return events.map((event) => {
            const eventObject = event.toObject();
            return {
                ...eventObject,
                id: String(event._id),
            };
        });
    }
    catch {
        return exports.fallbackEvents;
    }
};
exports.getEventList = getEventList;
const getEventById = async (id) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        return (exports.fallbackEvents.find((event) => event.id === id) ??
            exports.fallbackEvents[0] ??
            null);
    }
    try {
        const event = await Event_1.default.findById(id);
        if (!event) {
            return (exports.fallbackEvents.find((item) => item.id === id) ??
                exports.fallbackEvents[0] ??
                null);
        }
        const eventObject = event.toObject();
        return {
            ...eventObject,
            id: String(event._id),
        };
    }
    catch {
        return (exports.fallbackEvents.find((event) => event.id === id) ??
            exports.fallbackEvents[0] ??
            null);
    }
};
exports.getEventById = getEventById;
