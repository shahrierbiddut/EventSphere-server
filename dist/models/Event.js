"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const organizerSchema = new mongoose_1.Schema({
    id: { type: String },
    name: { type: String, required: true, trim: true },
    logoUrl: { type: String, trim: true },
    description: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
}, { _id: false });
const eventSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isFree: { type: Boolean, default: false },
    availableSeats: { type: Number, required: true, min: 0 },
    totalSeats: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, required: true, trim: true },
    galleryImages: [{ type: String, trim: true }],
    organizer: { type: organizerSchema, required: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    status: { type: String, enum: ["draft", "pending", "published", "rejected"], default: "published" },
    submittedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
eventSchema.virtual("id").get(function getId() {
    return this._id.toString();
});
const Event = mongoose_1.default.models.Event || mongoose_1.default.model("Event", eventSchema);
exports.default = Event;
