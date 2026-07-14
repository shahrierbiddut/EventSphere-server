"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedFAQs = exports.seedBlogs = exports.seedCategories = void 0;
exports.seedCategories = [
    {
        name: "Conference",
        slug: "conference",
        iconName: "Users",
        eventCount: 124,
    },
    { name: "Workshop", slug: "workshop", iconName: "BookOpen", eventCount: 86 },
    {
        name: "Technology",
        slug: "technology",
        iconName: "Laptop",
        eventCount: 245,
    },
    {
        name: "Business",
        slug: "business",
        iconName: "Briefcase",
        eventCount: 152,
    },
    { name: "Music", slug: "music", iconName: "Music", eventCount: 318 },
    { name: "Sports", slug: "sports", iconName: "Trophy", eventCount: 110 },
    {
        name: "Education",
        slug: "education",
        iconName: "GraduationCap",
        eventCount: 95,
    },
    { name: "Art", slug: "art", iconName: "Palette", eventCount: 174 },
    { name: "Food", slug: "food", iconName: "Coffee", eventCount: 204 },
    {
        name: "Entertainment",
        slug: "entertainment",
        iconName: "Star",
        eventCount: 88,
    },
    {
        name: "Health & Wellness",
        slug: "health-wellness",
        iconName: "Heart",
        eventCount: 67,
    },
    { name: "Gaming", slug: "gaming", iconName: "Gamepad2", eventCount: 43 },
];
exports.seedBlogs = [
    {
        title: "10 Tips for Hosting a Successful Tech Conference",
        slug: "10-tips-hosting-tech-conference",
        excerpt: "Planning a tech conference can be daunting. Here are our top 10 tips to ensure your event runs smoothly and attendees leave happy.",
        content: "Planning a tech conference can be daunting. Here are our top 10 tips to ensure your event runs smoothly and attendees leave happy...",
        author: {
            name: "Alex Rivera",
            email: "alex@eventsphere.com",
            avatarUrl: "https://i.pravatar.cc/150?u=alex",
        },
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
        category: "Event Planning",
        readTime: "5 min read",
        published: true,
    },
    {
        title: "The Future of Hybrid Events in 2025",
        slug: "future-hybrid-events-2025",
        excerpt: "As the world adapts, hybrid events are becoming the norm. Discover how to create engaging experiences for both in-person and virtual attendees.",
        content: "As the world adapts, hybrid events are becoming the norm. Discover how to create engaging experiences for both in-person and virtual attendees...",
        author: {
            name: "Jamie Lin",
            email: "jamie@eventsphere.com",
            avatarUrl: "https://i.pravatar.cc/150?u=jamie",
        },
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
        category: "Event Technology",
        readTime: "6 min read",
        published: true,
    },
    {
        title: "Building Community Through Events",
        slug: "building-community-through-events",
        excerpt: "Learn how successful event organizers create lasting communities around their events and build loyal audiences.",
        content: "Learn how successful event organizers create lasting communities around their events and build loyal audiences...",
        author: {
            name: "Sarah Chen",
            email: "sarah@eventsphere.com",
            avatarUrl: "https://i.pravatar.cc/150?u=sarah",
        },
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
        category: "Community",
        readTime: "4 min read",
        published: true,
    },
    {
        title: "Post-Event Metrics That Matter",
        slug: "post-event-metrics-that-matter",
        excerpt: "Understand which metrics to track after your event to measure success and improve future events.",
        content: "Understand which metrics to track after your event to measure success and improve future events...",
        author: {
            name: "Mike Johnson",
            email: "mike@eventsphere.com",
            avatarUrl: "https://i.pravatar.cc/150?u=mike",
        },
        imageUrl: "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=800&auto=format&fit=crop",
        category: "Analytics",
        readTime: "7 min read",
        published: true,
    },
];
exports.seedFAQs = [
    {
        question: "How do I book a ticket for an event?",
        answer: "Booking a ticket is simple. Navigate to the event details page, click the 'Book Now' button, and follow the checkout process. You'll need to be logged into your account to complete a booking.",
        category: "Booking",
        order: 1,
    },
    {
        question: "Is registration free?",
        answer: "Creating an account on EventSphere is completely free. You only pay for tickets to paid events. There are also many free events available on the platform.",
        category: "General",
        order: 1,
    },
    {
        question: "Can I get a refund if I can't attend?",
        answer: "Refund policies vary by event and are set by the individual organizers. Please check the specific event's details page for their cancellation and refund policy.",
        category: "Payments",
        order: 1,
    },
    {
        question: "How do I contact support?",
        answer: "You can reach our support team through the Contact Us page, by emailing support@eventsphere.com, or by calling our hotline during business hours.",
        category: "Support",
        order: 1,
    },
    {
        question: "Do I need to print my ticket?",
        answer: "No, you don't need to print your ticket. You can show the QR code or ticket ID on your mobile device at the event entrance.",
        category: "Booking",
        order: 2,
    },
];
